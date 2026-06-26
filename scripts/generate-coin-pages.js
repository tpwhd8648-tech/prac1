// =====================================================================
// scripts/generate-coin-pages.js
//
// coin-descriptions.js(정적 스펙) + products.js의 IMAGE_MAP(이미지 파일명) +
// 구글 시트(상품 정식명)를 결합해, 코인별 정적 HTML(coin-{slug}.html)과
// sitemap.xml을 생성한다.
//
// ── 빌드 시점에 박는 것 (정적) ──
//   상품 정식명(시트 name 컬럼), 스펙/설명(coin-descriptions.js),
//   canonical/og/JSON-LD(가격 포함 — 아래 설명 참고), 갤러리 이미지 경로
// ── 빌드 시점에 안 박는 것 (브라우저에서 실시간) ──
//   화면에 보이는 실제 가격/재고 뱃지, 짧은 설명(시트 description 컬럼)
//   → 화면 표시 가격은 여전히 매일 바뀌니 그대로 nav.js가 시트를 실시간
//     fetch해서 갱신함. 단 JSON-LD(검색엔진용 구조화 데이터)의 price는
//     "계산" 시트의 빌드 시점 금시세×환율로 계산해 정적으로 박아넣는다.
//     리치 스니펫에 필요한 price 필드가 없으면 구글이 Offer 자체를 무시
//     하므로, 100% 실시간보다는 "어제~오늘 시세 기준"이라도 박는 쪽을
//     택함. priceValidUntil(다음 빌드일)로 시세가 변동될 수 있음을 명시.
//     매일 1회(KST 00:00) Actions 빌드가 돌므로 최대 1일 지연.
//
// 실행: node scripts/generate-coin-pages.js  (레포 루트에서)
// =====================================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SHEET_ID = '1gMqKhtWwTAizoBGlrGDpm6sl5c6vmbotGzg3qXl16-w';
const SITE_URL = 'https://tpwhd8648-tech.github.io';

// ── 1. coin-descriptions.js / products.js를 "수정 없이" 그대로 읽어서
//      안에 정의된 const 값만 꺼내온다 (module.exports 없이도 동작) ──
function loadConstFromFile(filePath, constName) {
  const code = fs.readFileSync(filePath, 'utf8');
  const sandbox = {};
  const context = vm.createContext(sandbox);
  // vm 컨텍스트에서 선언된 const/let은 sandbox 객체에 직접 붙지 않으므로,
  // 코드 실행 후 this(=컨텍스트 전역)에 명시적으로 결과를 노출시켜 꺼낸다.
  vm.runInContext(`${code}\nthis.__EXPORTED__ = ${constName};`, context, { filename: filePath });
  const value = sandbox.__EXPORTED__;
  if (!value) throw new Error(`${filePath}에서 ${constName}을 찾지 못했습니다.`);
  return value;
}

const COIN_DESCRIPTIONS = loadConstFromFile(path.join(ROOT, 'assets/js/coin-descriptions.js'), 'COIN_DESCRIPTIONS');
// IMAGE_MAP은 2026-06-25 products.js에서 coin-data.js로 분리됨
// (index.html도 검색 자동완성에 IMAGE_MAP이 필요해져서 — coin-data.js
// 상단 주석 참고). 이 빌드 스크립트도 같은 파일에서 읽도록 갱신.
const IMAGE_MAP = loadConstFromFile(path.join(ROOT, 'assets/js/coin-data.js'), 'IMAGE_MAP');

// ── 2. 구글 시트 "상품" 탭에서 name/brand/premium/available을 가져온다.
//      (컬럼 순서는 products.js의 fetchProductsFromSheet와 동일:
//       A=name, B=brand, C=category, D=premium, E=available, F=same_day) ──
async function fetchSheetRows() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=상품`;
  const res = await fetch(url);
  const text = await res.text();
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
  if (!match) throw new Error('시트 응답 형식을 파싱할 수 없습니다.');
  const json = JSON.parse(match[1]);
  return json.table.rows
    .map(row => ({
      name:      row.c[0]?.v || '',
      brand:     row.c[1]?.v || '',
      category:  row.c[2]?.v || 'gold',
      premium:   parseFloat(row.c[3]?.v) || 1.03,
      available: String(row.c[4]?.v).toUpperCase() === 'TRUE',
      same_day:  String(row.c[5]?.v).toUpperCase() === 'TRUE',
      visible:   row.c[6] ? (String(row.c[6].v ?? '').toLowerCase() || 'all') : 'all',
      order:     row.c[7] ? parseInt(row.c[7].v) || 9999 : 9999,
    }))
    .filter(p => p.name);
}

// ── 2-1. 구글 시트 "계산" 탭에서 금시세(USD/oz)·환율(KRW/USD)을 가져와
//        krwPerOz(원/oz)를 계산한다. nav.js의 updateNavPrices()와 동일한
//        컬럼 순서(0=금, 4=환율)를 사용해 화면에 뜨는 가격과 일치시킨다. ──
async function fetchGoldRateKrwPerOz() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=계산`;
  const res = await fetch(url);
  const text = await res.text();
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
  if (!match) throw new Error('"계산" 시트 응답 형식을 파싱할 수 없습니다.');
  const json = JSON.parse(match[1]);
  const row = json.table.rows[0].c;
  const goldPriceUsd = row[0]?.v;
  const exchangeRate = row[4]?.v;
  if (!goldPriceUsd || !exchangeRate) {
    throw new Error('"계산" 시트에서 금시세 또는 환율 값을 찾지 못했습니다.');
  }
  return Number(goldPriceUsd) * Number(exchangeRate);
}

function matchByKeyword(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k.toLowerCase()));
}

// ── 3. coin-descriptions.js 항목 ↔ IMAGE_MAP 항목 ↔ 시트 row 매칭 ──
function buildCoinEntries(sheetRows) {
  const entries = [];
  const skipped = [];

  for (const desc of COIN_DESCRIPTIONS) {
    const imageEntry = IMAGE_MAP.find(img =>
      img.keywords.some(k => desc.keywords.some(dk => dk.toLowerCase() === k.toLowerCase()))
    );
    if (!imageEntry) {
      skipped.push({ keywords: desc.keywords, reason: 'IMAGE_MAP에 매칭되는 항목 없음' });
      continue;
    }

    const sheetRow = sheetRows.find(row => matchByKeyword(row.name, desc.keywords));
    if (!sheetRow) {
      skipped.push({ keywords: desc.keywords, reason: '시트에서 상품명을 찾지 못함 (품절/삭제 가능성)' });
      continue;
    }

    // products/2026/maple.png → maple-2026 (coin-{slug}.html 파일명 유지)
    const slugMatch = imageEntry.file.match(/products\/(\d{4})\/(.+)\.png$/i);
    const slug = slugMatch ? `${slugMatch[2]}-${slugMatch[1]}` : imageEntry.file.replace(/^products-/, '').replace(/\.png$/i, '');
    entries.push({
      slug,
      keywords: desc.keywords,
      detail: desc.detail.trim(),
      specs: desc.specs,
      imageFile: imageEntry.file,
      name: sheetRow.name,
      brand: sheetRow.brand || 'MIDAS BULLION',
      premium: sheetRow.premium,
      available: sheetRow.available,
    });
  }

  return { entries, skipped };
}

// ── HTML/속성 escape 유틸 ──
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

// ── 4. 코인 1개 → coin-{slug}.html 전체 문자열 생성 ──
//      (coin-maple-2026.html 1차 템플릿과 동일한 마크업/스크립트 구조)
function renderCoinPage(coin, krwPerOz, todayStr, relatedHtml = '') {
  const { slug, name, brand, detail, specs, imageFile, keywords, premium, available } = coin;
  const baseImg = imageFile.replace(/\.png$/i, '');
  const pageUrl = `${SITE_URL}/coins/coin-${slug}.html`;
  const mainImgUrl = `${SITE_URL}/images/${imageFile}`;
  const safeName = escapeHtml(name);
  const safeNameAttr = escapeAttr(name);
  const safeBrand = escapeHtml(brand);
  const shortDesc = detail.split('\n')[0].slice(0, 80);
  const jsonLdDescription = detail.replace(/\n/g, ' ').slice(0, 300);

  // 화면에 실제로 표시되는 가격과 동일한 공식
  // (updateCardPricesFromSheet() / products.js renderProductCard()와 일치).
  // krwPerOz는 "계산" 시트의 금시세(USD/oz) × 환율(KRW/USD)로 빌드 시점에 계산됨.
  const price = Math.round((krwPerOz * premium) / 1000) * 1000;
  // 빌드는 매일 1회(KST 00:00) 또는 코드 push 시 갱신되므로, 다음 빌드 전까지만
  // 유효한 가격임을 명시 (schema.org Offer의 priceValidUntil 권장 필드).
  const priceValidUntil = new Date(new Date(todayStr).getTime() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name,
    description: jsonLdDescription,
    image: mainImgUrl,
    brand: { '@type': 'Brand', name: brand },
    offers: {
      '@type': 'Offer',
      url: pageUrl,
      price: price,
      priceCurrency: 'KRW',
      priceValidUntil: priceValidUntil,
      availability: available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'MIDAS BULLION' },
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: '순도', value: specs.purity },
      { '@type': 'PropertyValue', name: '중량', value: specs.weight },
      { '@type': 'PropertyValue', name: '발행처', value: specs.mint },
      { '@type': 'PropertyValue', name: '발행국', value: specs.country },
      ...(specs.diameter ? [{ '@type': 'PropertyValue', name: '직경', value: specs.diameter }] : []),
    ],
  };

  // 화면에 보이는 빵 부스러기(홈으로 / 금화 보기 / 코인명)와 동일한 경로를
  // 구조화 데이터로도 제공 — 검색 결과에 경로(breadcrumb)가 표시되도록 함.
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈으로', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: '금화 보기', item: `${SITE_URL}/coins.html` },
      { '@type': 'ListItem', position: 3, name: name, item: pageUrl },
    ],
  };

  const specRows = `
              <tr><th>연도</th><td>${escapeHtml(specs.year || '확인 중')}</td></tr>
              <tr><th>발행처</th><td>${escapeHtml(specs.mint)}</td></tr>
              <tr><th>발행국</th><td>${escapeHtml(specs.country)}</td></tr>
              <tr><th>순도</th><td>${escapeHtml(specs.purity)}</td></tr>
              <tr><th>중량</th><td>${escapeHtml(specs.weight)}</td></tr>
              <tr><th>직경</th><td>${escapeHtml(specs.diameter || '확인 중')}</td></tr>
              ${specs.thickness ? `<tr><th>두께</th><td>${escapeHtml(specs.thickness)}</td></tr>` : ''}
              <tr><th>상태</th><td>${escapeHtml(specs.condition || '미사용 (Brilliant Uncirculated)')}</td></tr>`;

  const keywordsJs = JSON.stringify(keywords);

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MIDAS BULLION | ${safeName} - 투자 금화 구매</title>
  <meta name="description" content="${escapeAttr(shortDesc)} 중량, 순도, 발행처 등 상세 정보와 실시간 국제 시세를 확인하고 안전하게 구매하세요. MIDAS BULLION이 정품을 보증합니다.">
  <link rel="canonical" href="${pageUrl}">
  <link rel="icon" type="image/svg+xml" href="../favicon.svg">
  <link rel="preload" as="image" href="${mainImgUrl}" fetchpriority="high">
  <!-- Open Graph -->
  <meta property="og:type" content="product">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="MIDAS BULLION | ${safeName} - 투자 금화 구매">
  <meta property="og:description" content="${escapeAttr(shortDesc)}">
  <meta property="og:image" content="${mainImgUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="1200">
  <meta property="og:image:alt" content="${coin.name} 금화 - MIDAS BULLION">
  <meta property="og:site_name" content="MIDAS BULLION">
  <meta property="og:locale" content="ko_KR">
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="MIDAS BULLION | ${safeName} - 투자 금화 구매">
  <meta name="twitter:description" content="${escapeAttr(shortDesc)}">
  <meta name="twitter:image" content="${mainImgUrl}">
  <!-- JSON-LD: Product (price는 빌드 시점 금시세 기준, priceValidUntil로 변동 가능성 명시) -->
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
  <!-- JSON-LD: BreadcrumbList (화면 빵 부스러기와 동일한 경로) -->
  <script type="application/ld+json">
${JSON.stringify(breadcrumbJsonLd, null, 2)}
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600;700&family=Cinzel:wght@400;500;600;700&family=Noto+Sans+KR:wght@300;400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/style.css">
  <style>
    .sub-page { padding: 48px 0 80px; background: #f9f8f5; min-height: calc(100vh - 200px); }
    .sub-page .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
    .page-header { margin-bottom: 32px; display: flex; align-items: center; gap: 12px; }
    .page-header a { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: #C8A84B; font-family: 'Noto Sans KR', sans-serif; text-decoration: none; transition: opacity 0.2s; }
    .page-header a:hover { opacity: 0.7; }
    .page-header .divider { color: #ccc; }
    .page-header span.crumb { font-size: 13px; color: #999; font-family: 'Noto Sans KR', sans-serif; }

    .product-detail { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
    @media (max-width: 768px) { .product-detail { grid-template-columns: 1fr; gap: 32px; } }

    .gallery { display: flex; flex-direction: column; gap: 12px; }

    .gallery-main {
      width: 100%;
      aspect-ratio: 1;
      background: #fff;
      overflow: hidden;
      position: relative;
      cursor: crosshair;
      touch-action: pan-y;
    }

    .gallery-main img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 20px;
      box-sizing: border-box;
      transform-origin: center center;
      will-change: transform;
      transition: transform 0.3s ease;
      display: block;
    }

    .gallery-thumbs { display: flex; gap: 8px; flex-wrap: wrap; }
    .gallery-thumb { width: 72px; height: 72px; background: #fff; border: 2px solid transparent; cursor: pointer; overflow: hidden; transition: border-color 0.2s; flex-shrink: 0; }
    .gallery-thumb.active { border-color: #C8A84B; }
    .gallery-thumb img { width: 100%; height: 100%; object-fit: contain; padding: 6px; box-sizing: border-box; }
    .gallery-no-image { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1a1a1a, #2a2a2a); color: #C8A84B; font-family: 'Cinzel', serif; font-size: 14px; letter-spacing: 2px; }

    .product-info-panel { display: flex; flex-direction: column; gap: 20px; }
    .product-brand-label { font-family: 'Cinzel', serif; font-size: 12px; letter-spacing: 3px; color: #C8A84B; text-transform: uppercase; }
    .product-title { font-family: 'Noto Serif KR', serif; font-size: 26px; font-weight: 600; color: #1a1a1a; line-height: 1.4; margin: 0; }
    @media (max-width: 768px) { .product-title { font-size: 22px; } }

    .product-price-area { padding: 20px 0; border-top: 1px solid #e8e4d9; border-bottom: 1px solid #e8e4d9; }
    .product-price-label { font-size: 12px; color: #999; font-family: 'Noto Sans KR', sans-serif; margin-bottom: 6px; }
    .product-price-value { font-family: 'Cinzel', serif; font-size: 28px; color: #1a1a1a; letter-spacing: 1px; }
    .product-price-value.loading { font-size: 16px; color: #999; font-family: 'Noto Sans KR', sans-serif; }
    .product-price-note { font-size: 11px; color: #aaa; font-family: 'Noto Sans KR', sans-serif; margin-top: 4px; }

    .btn-inquiry {
      display: block; width: 100%; padding: 16px;
      background: #C8A84B; color: #fff;
      border: none; font-family: 'Noto Sans KR', sans-serif;
      font-size: 13px; letter-spacing: 1px; cursor: pointer;
      transition: background 0.2s, color 0.2s; text-align: center;
      text-decoration: none; box-sizing: border-box;
    }
    .btn-inquiry:hover { background: #F5E090; color: #1a1200; }
    .btn-back-coins {
      display: block; width: 100%; padding: 14px;
      background: transparent; color: #888;
      border: 1px solid #ddd; font-family: 'Noto Sans KR', sans-serif;
      font-size: 13px; cursor: pointer;
      transition: border-color 0.2s, color 0.2s; text-align: center;
      text-decoration: none; margin-top: 8px;
    }
    .btn-back-coins:hover { border-color: #999; color: #444; }

    .soldout-badge { display: inline-block; padding: 6px 16px; background: #2a2a2a; color: #666; font-family: 'Cinzel', serif; font-size: 12px; letter-spacing: 3px; border: 1px solid #333; }

    .detail-tabs-section { margin-top: 56px; }
    .detail-tabs { display: flex; gap: 0; border-bottom: 2px solid #e8e4d9; margin-bottom: 28px; flex-wrap: wrap; }
    .dtab { background: none; border: none; padding: 12px 24px; font-size: 14px; font-family: 'Noto Sans KR', sans-serif; color: #888; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; }
    .dtab.active, .dtab:hover { color: #C8A84B; border-bottom-color: #C8A84B; font-weight: 600; }
    @media (max-width: 480px) { .dtab { padding: 10px 14px; font-size: 13px; } }

    .detail-tab-panel { display: none; font-family: 'Noto Sans KR', sans-serif; font-size: 14px; color: #555; line-height: 1.9; max-width: 760px; min-height: 320px; }
    .detail-tab-panel.active { display: block; }
    .tab-detail-desc { white-space: pre-line; }

    .spec-table { width: 100%; border-collapse: collapse; }
    .spec-table tr { border-bottom: 1px solid #eee; }
    .spec-table th { text-align: left; width: 110px; padding: 14px 0; color: #999; font-weight: 500; font-size: 13px; vertical-align: top; }
    .spec-table td { padding: 14px 0; color: #333; }

    .error-msg { text-align: center; padding: 4rem; color: #888; font-family: 'Noto Sans KR', sans-serif; }

    .related-coins-section { margin-top: 64px; padding-top: 48px; border-top: 1px solid #e8e4d9; }
    .related-coins-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 24px; }
    .related-coins-title { font-family: 'Cinzel', serif; font-size: 15px; letter-spacing: 3px; color: #C8A84B; text-transform: uppercase; margin: 0; font-weight: 500; }
    .related-coins-more { font-size: 13px; color: #C8A84B; text-decoration: none; white-space: nowrap; }
    .related-coins-more:hover { text-decoration: underline; }
    .related-coins-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    @media (max-width: 768px) { .related-coins-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
    .related-card-current { outline: 2px solid #C8A84B; }

    .acc-item { border: 1px solid #e8e3d8; margin-bottom: -1px; background: #fff; }
    .acc-btn { width: 100%; display: flex; align-items: center; gap: 16px; padding: 18px 20px; cursor: pointer; background: none; border: none; text-align: left; transition: background 0.2s; }
    .acc-btn:hover { background: #faf8f2; }
    .acc-btn.active { background: #faf8f2; border-left: 3px solid #C8A84B; }
    .acc-num { width: 28px; height: 28px; border-radius: 50%; border: 1px solid #C8A84B; display: flex; align-items: center; justify-content: center; font-family: 'Cinzel', serif; font-size: 11px; color: #C8A84B; flex-shrink: 0; transition: all 0.2s; }
    .acc-btn.active .acc-num { background: #C8A84B; color: #fff; }
    .acc-btn-text { flex: 1; }
    .acc-btn-text strong { display: block; font-family: 'Noto Serif KR', serif; font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 2px; }
    .acc-btn-text span { font-family: 'Noto Sans KR', sans-serif; font-size: 11px; color: #aaa; }
    .acc-arrow { font-size: 16px; color: #C8A84B; transition: transform 0.3s; flex-shrink: 0; }
    .acc-btn.active .acc-arrow { transform: rotate(180deg); }
    .acc-body { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
    .acc-body.open { max-height: 600px; }
    .acc-body-inner { padding: 16px 20px 20px 64px; font-family: 'Noto Sans KR', sans-serif; font-size: 13px; color: #555; line-height: 1.9; border-top: 1px solid #f0ece2; }
    .acc-body-inner ul { padding-left: 16px; margin: 0; }
    .acc-body-inner ul li { margin-bottom: 6px; }
    .acc-body-inner .acc-step { display: flex; flex-direction: column; gap: 10px; }
    .acc-body-inner .step-row { display: flex; align-items: flex-start; gap: 12px; }
    .acc-body-inner .step-dot { width: 8px; height: 8px; border-radius: 50%; background: #C8A84B; flex-shrink: 0; margin-top: 6px; }
    .acc-body-inner .step-text strong { display: block; font-size: 13px; font-weight: 600; color: #1a1a1a; margin-bottom: 2px; }
    .acc-body-inner .step-text span { font-size: 12px; color: #aaa; }
  </style>
</head>
<body>
  <div class="top-bar" id="nav-topbar"></div>
  <header id="nav-header"></header>
  <nav id="nav-main"></nav>
  <div id="nav-mobile"></div>

  <section class="sub-page">
    <div class="container">
      <div class="page-header">
        <a href="../index.html">← 홈으로</a>
        <span class="divider">/</span>
        <a href="../coins.html">금화 보기</a>
        <span class="divider">/</span>
        <span class="crumb">${safeName}</span>
      </div>

      <div id="detail-content">
        <div class="product-detail">
          <div class="gallery">
            <div class="gallery-main">
              <img id="gallery-main-img" src="../images/${baseImg}.png" alt="${safeNameAttr} 앞면" fetchpriority="high"
                onerror="this.style.display='none';document.getElementById('gallery-no-img').style.display='flex'">
              <span class="badge-instock" id="stock-badge" style="display:none">IN STOCK</span>
              <span class="badge-presale" id="presale-badge" style="display:none">PRE SALE</span>
              <span class="badge-soldout" id="soldout-badge" style="display:none">SOLD OUT</span>
              <div id="gallery-no-img" class="gallery-no-image" style="display:none">${escapeHtml(name.slice(0, 6))}</div>
            </div>
            <div class="gallery-thumbs" id="gallery-thumbs">
              <div class="gallery-thumb active" onclick="switchImage(0)" data-index="0">
                <img src="../images/${baseImg}.png" alt="${safeNameAttr} 앞면" loading="lazy"
                  onerror="this.parentElement.style.display='none'">
              </div>
              <div class="gallery-thumb" onclick="switchImage(1)" data-index="1">
                <img src="../images/${baseImg}-back.png" alt="${safeNameAttr} 뒷면" loading="lazy"
                  onerror="this.parentElement.style.display='none'">
              </div>
            </div>
          </div>
          <div class="product-info-panel">
            <div class="product-brand-label">${safeBrand}</div>
            <h1 class="product-title">${safeName}</h1>
            <div class="product-price-area">
              <div class="product-price-label">판매가</div>
              <div class="product-price-value loading" id="detail-price-value">로딩 중...</div>
              <div class="product-price-note">* 금 시세에 따라 변동될 수 있습니다</div>
            </div>
            <div>
              <a href="https://open.kakao.com/o/sB6Gduni" target="_blank" rel="noopener noreferrer" class="btn-inquiry" id="inquiry-btn">구매 문의하기</a>
              <a href="../coins.html" class="btn-back-coins">← 목록으로 돌아가기</a>
            </div>
          </div>
        </div>

        <div class="detail-tabs-section">
          <div class="detail-tabs">
            <button class="dtab active" data-tab="desc" onclick="switchDetailTab('desc')">상품설명</button>
            <button class="dtab" data-tab="info" onclick="switchDetailTab('info')">상품정보</button>
            <button class="dtab" data-tab="guide" onclick="switchDetailTab('guide')">구매안내</button>
          </div>
          <div class="detail-tab-panel active" data-panel="desc">
            <div class="tab-detail-desc">${escapeHtml(detail)}</div>
          </div>
          <div class="detail-tab-panel" data-panel="info">
            <table class="spec-table">${specRows}
            </table>
          </div>
          <div class="detail-tab-panel" data-panel="guide">
            <div class="acc-item">
              <button class="acc-btn" onclick="toggleAcc(this)">
                <div class="acc-num">1</div>
                <div class="acc-btn-text">
                  <strong>자주 묻는 질문 (FAQ)</strong>
                  <span>구매 전 꼭 확인하세요</span>
                </div>
                <span class="acc-arrow">▾</span>
              </button>
              <div class="acc-body">
                <div class="acc-body-inner">
                  <ul>
                    <li>금화는 법정화폐로 인정되며 투자 및 수집 목적으로 구매 가능합니다.</li>
                    <li>모든 상품은 공인 조폐국 발행 정품이며 진품 보증서가 포함됩니다.</li>
                    <li>부가세(VAT)는 금 투자 상품에 한해 면세 적용됩니다.</li>
                    <li>소량(1oz 미만)부터 대량 구매까지 모두 상담 가능합니다.</li>
                    <li>IN STOCK 상품은 당일 매장 수령, PRE SALE 상품은 입고 후 안내드립니다.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="acc-item">
              <button class="acc-btn" onclick="toggleAcc(this)">
                <div class="acc-num">2</div>
                <div class="acc-btn-text">
                  <strong>가격 및 시세 안내</strong>
                  <span>금화 가격은 어떻게 결정되나요?</span>
                </div>
                <span class="acc-arrow">▾</span>
              </button>
              <div class="acc-body">
                <div class="acc-body-inner">
                  <ul>
                    <li>금화 가격은 국제 금 현물 시세(XAU/USD)에 연동됩니다.</li>
                    <li>환율 및 프리미엄(제조·유통 비용)이 반영된 최종 가격으로 안내드립니다.</li>
                    <li>표시 가격은 매일 시세 기준으로 갱신되며 구매 시점에 재확인됩니다.</li>
                    <li>대량 구매 시 별도 협의 가격 적용이 가능합니다.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="acc-item">
              <button class="acc-btn" onclick="toggleAcc(this)">
                <div class="acc-num">3</div>
                <div class="acc-btn-text">
                  <strong>구매 절차</strong>
                  <span>문의부터 수령까지의 과정</span>
                </div>
                <span class="acc-arrow">▾</span>
              </button>
              <div class="acc-body">
                <div class="acc-body-inner">
                  <div class="acc-step">
                    <div class="step-row">
                      <div class="step-dot"></div>
                      <div class="step-text">
                        <strong>1단계 · 문의 및 상담</strong>
                        <span>카카오톡 채널로 원하시는 상품과 수량 문의</span>
                      </div>
                    </div>
                    <div class="step-row">
                      <div class="step-dot"></div>
                      <div class="step-text">
                        <strong>2단계 · 견적 확인</strong>
                        <span>실시간 시세 기반 최종 가격 안내</span>
                      </div>
                    </div>
                    <div class="step-row">
                      <div class="step-dot"></div>
                      <div class="step-text">
                        <strong>3단계 · 결제</strong>
                        <span>계좌이체 또는 협의된 결제 방식으로 진행</span>
                      </div>
                    </div>
                    <div class="step-row">
                      <div class="step-dot"></div>
                      <div class="step-text">
                        <strong>4단계 · 수령</strong>
                        <span>매장 직접 수령 또는 안전 포장 후 등기 발송</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="acc-item">
              <button class="acc-btn" onclick="toggleAcc(this)">
                <div class="acc-num">4</div>
                <div class="acc-btn-text">
                  <strong>배송 및 교환·환불 안내</strong>
                  <span>안전하게 받아보시는 방법</span>
                </div>
                <span class="acc-arrow">▾</span>
              </button>
              <div class="acc-body">
                <div class="acc-body-inner">
                  <ul>
                    <li>모든 금화는 전문 안전 포장재로 이중 포장 후 등기 또는 특송으로 발송됩니다.</li>
                    <li>배송비는 구매 금액 및 수량에 따라 별도 안내드립니다.</li>
                    <li>직접 방문 수령을 원하시면 사전 예약 후 가능합니다.</li>
                    <li>금 시세 상품의 특성상 단순 변심에 의한 교환·환불은 어렵습니다.</li>
                    <li>상품 하자 또는 오배송의 경우 수령일로부터 7일 이내 문의해 주세요.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
${relatedHtml}
  </section>

  <footer id="site-footer"></footer>

  <script type="module" src="../assets/js/auth.js"></script>
  <script src="../assets/js/footer.js"></script>
  <script src="../assets/js/nav.js"></script>
  <script src="../assets/js/coin-data.js"></script>
  <script src="../assets/js/products.js"></script>
  <script>
    // ===== 이 코인의 매칭 키워드 (coin-descriptions.js / IMAGE_MAP과 동일 패턴) =====
    const COIN_KEYWORDS = ${keywordsJs};

    // nav.js가 시세를 갱신할 때 호출하는 공통 함수명과 동일하게 선언.
    // premium은 loadPriceAndStock()에서 시트를 받아온 뒤 채워진다.
    let _coinPremium = null;
    let _isAvailable = true;

    function updateCardPricesFromSheet(krwPerOz) {
      if (_coinPremium === null) return; // 아직 시트 로딩 전
      const priceEl = document.getElementById('detail-price-value');
      if (!priceEl) return;
      if (!_isAvailable) {
        priceEl.textContent = '-';
        priceEl.classList.remove('loading');
        return;
      }
      const price = Math.round(krwPerOz * _coinPremium / 1000) * 1000;
      priceEl.textContent = \`₩\${price.toLocaleString()}\`;
      priceEl.classList.remove('loading');
    }

    function findThisCoinInSheet(products) {
      return products.find(p => {
        const lower = p.name.toLowerCase();
        return COIN_KEYWORDS.some(k => lower.includes(k.toLowerCase()));
      });
    }

    async function loadPriceAndStock() {
      try {
        const products = await fetchProductsFromSheet({ includeAll: true });
        const product = findThisCoinInSheet(products);

        if (!product) {
          document.getElementById('detail-price-value').textContent = '가격 문의';
          document.getElementById('detail-price-value').classList.remove('loading');
          return;
        }

        _coinPremium = product.premium;

        const isAvailable = product.available === 'TRUE' || product.available === true;
        const isSameDay = product.same_day === 'TRUE' || product.same_day === true;
        _isAvailable = isAvailable;

        if (isAvailable && isSameDay) document.getElementById('stock-badge').style.display = '';
        if (isAvailable && !isSameDay) document.getElementById('presale-badge').style.display = '';

        if (!isAvailable) {
          document.getElementById('soldout-badge').style.display = '';
          document.getElementById('inquiry-btn').outerHTML =
            '<div style="text-align:center;padding:12px 0;"><span class="soldout-badge" style="position:static;font-size:13px;padding:8px 20px;">현재 품절된 상품입니다</span></div>';
          const priceEl = document.getElementById('detail-price-value');
          priceEl.textContent = '-';
          priceEl.classList.remove('loading');
        }

        // sessionStorage 캐시에서 직접 읽기 (DOM 텍스트 파싱 간접 참조 제거)
        // 아직 캐시가 없는 경우엔 nav.js가 updateNavPrices() 완료 후
        // updateCardPricesFromSheet()를 직접 호출해 줌.
        try {
          const cached = JSON.parse(sessionStorage.getItem('midas_price_cache') || 'null');
          if (cached && cached.goldPrice && cached.exchangeRate) {
            updateCardPricesFromSheet(cached.goldPrice * cached.exchangeRate);
          }
        } catch (_) {}
      } catch (e) {
        console.error('가격 로딩 오류:', e);
        const priceEl = document.getElementById('detail-price-value');
        priceEl.textContent = '가격 문의';
        priceEl.classList.remove('loading');
      }
    }

    function switchDetailTab(tabName) {
      document.querySelectorAll('.dtab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
      document.querySelectorAll('.detail-tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === tabName));
    }

    function toggleAcc(btn) {
      const body = btn.nextElementSibling;
      const isOpen = body.classList.contains('open');
      btn.classList.toggle('active', !isOpen);
      body.classList.toggle('open', !isOpen);
    }

    function switchImage(index) {
      const thumbs = document.querySelectorAll('.gallery-thumb');
      const mainImg = document.getElementById('gallery-main-img');
      const noImg = document.getElementById('gallery-no-img');
      if (!mainImg) return;

      thumbs.forEach((t, i) => t.classList.toggle('active', i === index));
      const thumbImg = thumbs[index]?.querySelector('img');
      const src = thumbImg?.src;
      const altText = thumbImg?.alt;
      if (src) {
        mainImg.style.transition = 'opacity 0.15s ease, transform 0.3s ease';
        mainImg.style.opacity = '0';
        setTimeout(() => {
          mainImg.src = src;
          if (altText) mainImg.alt = altText;
          mainImg.style.display = '';
          if (noImg) noImg.style.display = 'none';
          mainImg.style.opacity = '1';
          mainImg.style.transform = 'scale(1) translate(0,0)';
        }, 150);
      }
    }

    function initMagnifier() {
      const galleryMain = document.querySelector('.gallery-main');
      if (!galleryMain) return;

      const zoom = 2.5;
      let cachedRect = null;

      function getPos(e, rect) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        let x = (clientX - rect.left) / rect.width;
        let y = (clientY - rect.top) / rect.height;
        x = Math.max(0, Math.min(1, x));
        y = Math.max(0, Math.min(1, y));
        return { x, y };
      }

      function applyZoom(x, y) {
        const img = document.getElementById('gallery-main-img');
        if (!img || img.style.display === 'none') return;
        const tx = (0.5 - x) * (zoom - 1) * 100;
        const ty = (0.5 - y) * (zoom - 1) * 100;
        img.style.transition = 'none';
        img.style.transform = \`scale(\${zoom}) translate(\${tx}%, \${ty}%)\`;
      }

      function resetZoom() {
        const img = document.getElementById('gallery-main-img');
        if (!img) return;
        img.style.transition = 'transform 0.3s ease';
        img.style.transform = 'scale(1) translate(0,0)';
      }

      galleryMain.addEventListener('mouseenter', (e) => {
        cachedRect = galleryMain.getBoundingClientRect();
        const { x, y } = getPos(e, cachedRect);
        applyZoom(x, y);
      });

      galleryMain.addEventListener('mousemove', (e) => {
        const { x, y } = getPos(e, cachedRect);
        applyZoom(x, y);
      });

      galleryMain.addEventListener('mouseleave', () => {
        cachedRect = null;
        resetZoom();
      });

      const DIRECTION_THRESHOLD = 10;
      const HOLD_MS = 150;
      let touchStartX = 0;
      let touchStartY = 0;
      let mode = 'pending';
      let holdTimer = null;

      function clearHoldTimer() {
        if (holdTimer) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }
      }

      galleryMain.addEventListener('touchstart', (e) => {
        cachedRect = galleryMain.getBoundingClientRect();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        mode = 'pending';

        clearHoldTimer();
        holdTimer = setTimeout(() => {
          if (mode === 'pending') {
            mode = 'zoom';
            cachedRect = galleryMain.getBoundingClientRect();
            const { x, y } = getPos(
              { touches: [{ clientX: touchStartX, clientY: touchStartY }] },
              cachedRect
            );
            applyZoom(x, y);
          }
        }, HOLD_MS);
      }, { passive: false });

      galleryMain.addEventListener('touchmove', (e) => {
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;

        if (mode === 'scroll') {
          return;
        }

        if (mode === 'zoom') {
          e.preventDefault();
          cachedRect = galleryMain.getBoundingClientRect();
          const { x, y } = getPos(e, cachedRect);
          applyZoom(x, y);
          return;
        }

        const dx = currentX - touchStartX;
        const dy = currentY - touchStartY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > DIRECTION_THRESHOLD) {
          clearHoldTimer();
          if (Math.abs(dy) > Math.abs(dx) * 1.2) {
            mode = 'scroll';
          } else {
            mode = 'zoom';
            e.preventDefault();
            cachedRect = galleryMain.getBoundingClientRect();
            const { x, y } = getPos(e, cachedRect);
            applyZoom(x, y);
          }
        }
      }, { passive: false });

      galleryMain.addEventListener('touchend', () => {
        clearHoldTimer();
        cachedRect = null;
        mode = 'pending';
        resetZoom();
      });

      galleryMain.addEventListener('touchcancel', () => {
        clearHoldTimer();
        cachedRect = null;
        mode = 'pending';
        resetZoom();
      });
    }

    loadPriceAndStock();
    initMagnifier();
  </script>
</body>
</html>
`;
}

// ── 5. 상품 그리드 정적 HTML 생성 ──
// products.js의 createProductCard와 동일한 마크업을 생성한다.
// 가격은 data-premium attribute만 박아두고, 브라우저에서 JS가
// updateCardPricesFromSheet()로 실시간 갱신한다.
function getSlugFromImageMap(name) {
  const lower = name.toLowerCase();
  for (const entry of IMAGE_MAP) {
    if (entry.keywords.some(k => lower.includes(k.toLowerCase()))) {
      const m = entry.file.match(/products\/(\d{4})\/(.+)\.png$/i);
      return m ? `${m[2]}-${m[1]}` : entry.file.replace(/^products-/, '').replace(/\.png$/, '');
    }
  }
  return null;
}

function getImageFileFromImageMap(name) {
  const lower = name.toLowerCase();
  for (const entry of IMAGE_MAP) {
    if (entry.keywords.some(k => lower.includes(k.toLowerCase()))) {
      return `images/${entry.file}`;
    }
  }
  return null;
}

function getCategoryFilter(category) {
  const map = {
    'gold_1oz': 'gold', 'gold': 'gold',
    'silver_1oz': 'silver', 'silver': 'silver',
    'collectible': 'collectible', 'other': 'other',
    'accessories': 'accessories', 'merchandise': 'merchandise',
  };
  return map[category] || category;
}

function renderProductCard(product, linkUrl, opts = {}) {
  const { name, brand, category, premium, available, same_day } = product;
  const imgSrc = getImageFileFromImageMap(name);
  const filterCategory = getCategoryFilter(category);
  const isSameDay = same_day === true;
  const isAvailable = available === true;

  const imgHTML = imgSrc
    ? `<img src="${imgSrc}" alt="${name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';
  const placeholderHTML = `<div class="product-img-placeholder" style="${imgSrc ? 'display:none' : 'display:flex'}"><span>${name.substring(0, 6)}</span></div>`;

  let badgeHTML = '';
  if (isAvailable && isSameDay)  badgeHTML = '<span class="badge-instock">IN STOCK</span>';
  if (isAvailable && !isSameDay) badgeHTML = '<span class="badge-presale">PRE SALE</span>';
  if (!isAvailable)              badgeHTML = '<span class="badge-soldout">SOLD OUT</span>';

  const btnText = !isAvailable ? (opts.soldoutBtnText || '품절') : '상품 보기';
  const btnClass = !isAvailable ? 'btn-cart btn-soldout' : 'btn-cart btn-buy';
  const btnHTML = `<button class="${btnClass}" onclick="event.stopPropagation(); location.href='${linkUrl}'">${btnText}</button>`;

  return `
    <div class="product-card ${!isAvailable ? 'card-soldout' : ''}" data-category="${filterCategory}" data-brand="${brand}" data-premium="${premium}"
      onclick="location.href='${linkUrl}'">
      <div class="product-img-area">
        ${imgHTML}
        ${placeholderHTML}
        ${badgeHTML}
      </div>
      <div class="product-info">
        <p class="product-brand">${brand}</p>
        <h3 class="product-name">${name}</h3>
        <div class="product-price-wrap">
          <span class="product-price card-price">${isAvailable ? '' : '-'}</span>
        </div>
        <div class="btn-cart-wrap">
          ${btnHTML}
        </div>
      </div>
    </div>`;
}

// ── 5-1. 당일수령 가능 금화 섹션 ──
// 자기 자신 포함 IN STOCK 코인을 order 순으로 최대 4개 표시.
// 빌드 시점 기준이므로 매일 00:00 KST Actions 빌드 때 갱신됨.
function renderRelatedCoins(currentSlug, allEntries, sheetRows) {
  // allEntries 중 IN STOCK(available=true, same_day=true)인 것을 최대 4개
  const related = [];
  for (const entry of allEntries) {
    if (related.length >= 4) break;
    const row = sheetRows.find(r => matchByKeyword(r.name, entry.keywords));
    if (!row) continue;
    if (row.available !== true || row.same_day !== true) continue;
    related.push({ entry, row });
  }

  if (related.length === 0) return '';

  const cards = related.map(({ entry, row }) => {
    const linkUrl = `coin-${entry.slug}.html`;
    const imgSrc = `../images/${entry.imageFile}`;
    const isCurrent = entry.slug === currentSlug;
    return `
      <div class="product-card${isCurrent ? ' related-card-current' : ''}" onclick="location.href='${linkUrl}'" style="cursor:pointer;">
        <div class="product-img-area">
          <img src="${imgSrc}" alt="${escapeAttr(row.name)}" loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="product-img-placeholder" style="display:none"><span>${escapeHtml(row.name.substring(0, 6))}</span></div>
          <span class="badge-instock">IN STOCK</span>
        </div>
        <div class="product-info">
          <p class="product-brand">${escapeHtml(row.brand || 'MIDAS BULLION')}</p>
          <h3 class="product-name">${escapeHtml(row.name)}</h3>
          <div class="product-price-wrap">
            <span class="product-price card-price"></span>
          </div>
          <div class="btn-cart-wrap">
            <button class="btn-cart btn-buy" onclick="event.stopPropagation(); location.href='${linkUrl}'">상품 보기</button>
          </div>
        </div>
      </div>`;
  }).join('\n');

  return `
        <div class="related-coins-section">
          <div class="related-coins-header">
            <h2 class="related-coins-title">당일수령 가능 금화</h2>
            <a href="../coins.html?instock" class="related-coins-more">당일수령 더보기 ›</a>
          </div>
          <div class="related-coins-grid">
            ${cards}
          </div>
        </div>`;
}

// index.html용: visible='main' or 'all', 클릭 시 coin-{slug}.html 이동
function renderIndexGrid(sheetRows) {
  const products = sheetRows
    .filter(p => ['all', 'main'].includes(p.visible))
    .sort((a, b) => {
      if (a.available !== b.available) return a.available ? -1 : 1;
      return a.order - b.order;
    });

  return products.map(p => {
    const slug = getSlugFromImageMap(p.name);
    const linkUrl = slug ? `coins/coin-${slug}.html` : `coin-detail.html?name=${encodeURIComponent(p.name)}`;
    return renderProductCard(p, linkUrl, {});
  }).join('\n');
}

// coins.html용: visible='coins' or 'all', 클릭 시 coin-{slug}.html 이동
function renderCoinsGrid(sheetRows) {
  const products = sheetRows
    .filter(p => ['all', 'coins'].includes(p.visible))
    .sort((a, b) => {
      if (a.available !== b.available) return a.available ? -1 : 1;
      return a.order - b.order;
    });

  return products.map(p => {
    const slug = getSlugFromImageMap(p.name);
    const linkUrl = slug ? `coins/coin-${slug}.html` : `coin-detail.html?name=${encodeURIComponent(p.name)}`;
    return renderProductCard(p, linkUrl, { soldoutBtnText: '상품 보기' });
  }).join('\n');
}

// HTML 파일의 #products-grid 내부를 정적 카드 HTML로 교체한다.
// 마커: <!-- SSG_GRID_START --> ... <!-- SSG_GRID_END -->
function injectGrid(html, gridHtml) {
  const START = '<!-- SSG_GRID_START -->';
  const END   = '<!-- SSG_GRID_END -->';
  const startIdx = html.indexOf(START);
  const endIdx   = html.indexOf(END);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`SSG_GRID 마커를 찾을 수 없습니다. HTML에 ${START} ... ${END} 마커를 추가해주세요.`);
  }
  return html.slice(0, startIdx + START.length) + '\n' + gridHtml + '\n' + html.slice(endIdx);
}

// ── 6. sitemap.xml 생성 (고정 페이지 + 코인별 페이지) ──
function renderSitemap(coinEntries, todayStr) {
  const fixedUrls = [
    { loc: `${SITE_URL}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${SITE_URL}/coins.html`, changefreq: 'daily', priority: '0.8' },
    { loc: `${SITE_URL}/gold-price.html`, changefreq: 'daily', priority: '0.8' },
    { loc: `${SITE_URL}/contact.html`, changefreq: 'monthly', priority: '0.5' },
  ];
  const coinUrls = coinEntries.map(c => ({
    loc: `${SITE_URL}/coins/coin-${c.slug}.html`,
    changefreq: 'daily',
    priority: '0.7',
  }));

  const allUrls = [...fixedUrls, ...coinUrls];
  const body = allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${todayStr}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

// ── 메인 실행 ──
async function main() {
  console.log('구글 시트에서 상품 정보(이름/프리미엄/재고) 가져오는 중...');
  const sheetRows = await fetchSheetRows();
  console.log(`시트 상품 ${sheetRows.length}개 로드 완료`);

  console.log('구글 시트 "계산" 탭에서 금시세/환율 가져오는 중...');
  const krwPerOz = await fetchGoldRateKrwPerOz();
  console.log(`krwPerOz = ${krwPerOz.toLocaleString()}원/oz`);

  const { entries, skipped } = buildCoinEntries(sheetRows);
  console.log(`코인 페이지 생성 대상: ${entries.length}개`);
  if (skipped.length > 0) {
    console.log(`\n⚠ 건너뛴 항목 ${skipped.length}개:`);
    skipped.forEach(s => console.log(`  - [${s.keywords.join(', ')}] ${s.reason}`));
  }

  // KST 기준 날짜로 lastmod/priceValidUntil 기록
  const kstDate = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);

  let changedCount = 0;
  for (const coin of entries) {
    const filePath = path.join(ROOT, 'coins', `coin-${coin.slug}.html`);
    const relatedHtml = renderRelatedCoins(coin.slug, entries, sheetRows);
    const html = renderCoinPage(coin, krwPerOz, kstDate, relatedHtml);
    const prev = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
    if (prev !== html) {
      fs.writeFileSync(filePath, html, 'utf8');
      changedCount++;
      console.log(`  ✓ coin-${coin.slug}.html ${prev === null ? '(신규)' : '(갱신)'}`);
    }
  }

  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  const newSitemap = renderSitemap(entries, kstDate);
  const prevSitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : null;
  if (prevSitemap !== newSitemap) {
    fs.writeFileSync(sitemapPath, newSitemap, 'utf8');
    console.log('  ✓ sitemap.xml 갱신');
    changedCount++;
  }

  // ── index.html / coins.html 상품 그리드 정적 주입 ──
  const gridFiles = [
    { file: 'index.html',  gridFn: renderIndexGrid,  label: 'index.html 상품 그리드' },
    { file: 'coins.html',  gridFn: renderCoinsGrid,  label: 'coins.html 상품 그리드' },
  ];
  for (const { file, gridFn, label } of gridFiles) {
    const filePath = path.join(ROOT, file);
    const prev = fs.readFileSync(filePath, 'utf8');
    try {
      const gridHtml = gridFn(sheetRows);
      const next = injectGrid(prev, gridHtml);
      if (prev !== next) {
        fs.writeFileSync(filePath, next, 'utf8');
        changedCount++;
        console.log(`  ✓ ${label} 갱신`);
      } else {
        console.log(`  - ${label} 변경 없음`);
      }
    } catch (e) {
      console.warn(`  ⚠ ${label} 주입 실패: ${e.message}`);
    }
  }

  console.log(`\n총 ${entries.length}개 페이지 생성 대상, ${changedCount}개 파일 변경됨.`);
  // 변경 파일 수를 다음 스텝(workflow)에서 커밋 여부 판단에 쓸 수 있도록 출력
  console.log(`::set-output name=changed::${changedCount}`);
}

main().catch(err => {
  console.error('생성 스크립트 오류:', err);
  process.exit(1);
});
