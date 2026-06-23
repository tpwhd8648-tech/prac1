// =====================================================================
// scripts/generate-coin-pages.js
//
// coin-descriptions.js(정적 스펙) + products.js의 IMAGE_MAP(이미지 파일명) +
// 구글 시트(상품 정식명)를 결합해, 코인별 정적 HTML(coin-{slug}.html)과
// sitemap.xml을 생성한다.
//
// ── 빌드 시점에 박는 것 (정적) ──
//   상품 정식명(시트 name 컬럼), 스펙/설명(coin-descriptions.js),
//   canonical/og/JSON-LD, 갤러리 이미지 경로
// ── 빌드 시점에 안 박는 것 (브라우저에서 실시간) ──
//   가격, 재고(available/same_day), 짧은 설명(시트 description 컬럼)
//   → 네이버봇이 못 읽어도 가격은 매일 바뀌니 정적 파일에 고정하면
//     위험하다는 1단계(coin-maple-2026.html)와 동일한 원칙.
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

const COIN_DESCRIPTIONS = loadConstFromFile(path.join(ROOT, 'coin-descriptions.js'), 'COIN_DESCRIPTIONS');
const IMAGE_MAP = loadConstFromFile(path.join(ROOT, 'products.js'), 'IMAGE_MAP');

// ── 2. 구글 시트에서 상품 정식명(name)만 가져온다 (가격/재고는 안 씀) ──
async function fetchSheetNames() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=상품`;
  const res = await fetch(url);
  const text = await res.text();
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
  if (!match) throw new Error('시트 응답 형식을 파싱할 수 없습니다.');
  const json = JSON.parse(match[1]);
  return json.table.rows
    .map(row => ({
      name: row.c[0]?.v || '',
      brand: row.c[1]?.v || '',
    }))
    .filter(p => p.name);
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

    const slug = imageEntry.file.replace(/^products-/, '').replace(/\.png$/i, '');
    entries.push({
      slug,
      keywords: desc.keywords,
      detail: desc.detail.trim(),
      specs: desc.specs,
      imageFile: imageEntry.file,
      name: sheetRow.name,
      brand: sheetRow.brand || 'MIDAS BULLION',
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
function renderCoinPage(coin) {
  const { slug, name, brand, detail, specs, imageFile, keywords } = coin;
  const baseImg = imageFile.replace(/\.png$/i, '');
  const pageUrl = `${SITE_URL}/coin-${slug}.html`;
  const mainImgUrl = `${SITE_URL}/images/${imageFile}`;
  const safeName = escapeHtml(name);
  const safeNameAttr = escapeAttr(name);
  const safeBrand = escapeHtml(brand);
  const shortDesc = detail.split('\n')[0].slice(0, 80);
  const jsonLdDescription = detail.replace(/\n/g, ' ').slice(0, 300);

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
      priceCurrency: 'KRW',
      availability: 'https://schema.org/InStock',
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
  <title>MIDAS BULLION | ${safeName}</title>
  <meta name="description" content="${escapeAttr(shortDesc)} 중량, 순도, 발행처 등 상세 정보와 실시간 국제 시세를 확인하고 안전하게 구매하세요. MIDAS BULLION이 정품을 보증합니다.">
  <link rel="canonical" href="${pageUrl}">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <!-- Open Graph -->
  <meta property="og:type" content="product">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="MIDAS BULLION | ${safeName}">
  <meta property="og:description" content="${escapeAttr(shortDesc)}">
  <meta property="og:image" content="${mainImgUrl}">
  <meta property="og:site_name" content="MIDAS BULLION">
  <meta property="og:locale" content="ko_KR">
  <!-- JSON-LD: Product (정적 스펙 기반, 가격은 실시간 연동이라 제외) -->
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600;700&family=Cinzel:wght@400;500;600;700&family=Noto+Sans+KR:wght@300;400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
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
        <a href="index.html">← 홈으로</a>
        <span class="divider">/</span>
        <a href="coins.html">금화 보기</a>
        <span class="divider">/</span>
        <span class="crumb">${safeName}</span>
      </div>

      <div id="detail-content">
        <div class="product-detail">
          <div class="gallery">
            <div class="gallery-main">
              <img id="gallery-main-img" src="images/${baseImg}.png" alt="${safeNameAttr}"
                onerror="this.style.display='none';document.getElementById('gallery-no-img').style.display='flex'">
              <span class="badge-instock" id="stock-badge" style="display:none">IN STOCK</span>
              <span class="badge-presale" id="presale-badge" style="display:none">PRE SALE</span>
              <div id="gallery-no-img" class="gallery-no-image" style="display:none">${escapeHtml(name.slice(0, 6))}</div>
            </div>
            <div class="gallery-thumbs" id="gallery-thumbs">
              <div class="gallery-thumb active" onclick="switchImage(0)" data-index="0">
                <img src="images/${baseImg}.png" alt="앞면" loading="lazy"
                  onerror="this.parentElement.style.display='none'">
              </div>
              <div class="gallery-thumb" onclick="switchImage(1)" data-index="1">
                <img src="images/${baseImg}-back.png" alt="뒷면" loading="lazy"
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
              <div id="detail-soldout-wrap" style="display:none;margin-top:10px;"><span class="soldout-badge">SOLD OUT</span></div>
            </div>
            <div>
              <a href="https://open.kakao.com/o/sB6Gduni" target="_blank" rel="noopener noreferrer" class="btn-inquiry" id="inquiry-btn">구매 문의하기</a>
              <a href="coins.html" class="btn-back-coins">← 목록으로 돌아가기</a>
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
            <p>본 상품의 판매가는 실시간 국제 금 시세와 환율을 반영하여 매일 변동됩니다.</p>
            <p>구매를 원하시면 하단의 [구매 문의하기] 버튼을 통해 카카오톡 채널로 문의해 주세요.
            담당자가 결제 방법, 배송(또는 매장 수령), 정품 보증서 발급 등을 안내해 드립니다.</p>
            <p>상품 이미지의 IN STOCK / PRE SALE 뱃지로 당일 수령 가능 여부를 확인할 수 있습니다.</p>
            <p>교환·환불 등 세부 정책은 문의 시 담당자를 통해 정확히 안내받으실 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer id="site-footer"></footer>

  <script type="module" src="auth.js"></script>
  <script src="footer.js"></script>
  <script src="nav.js"></script>
  <script src="products.js"></script>
  <script>
    // ===== 이 코인의 매칭 키워드 (coin-descriptions.js / IMAGE_MAP과 동일 패턴) =====
    const COIN_KEYWORDS = ${keywordsJs};

    // nav.js가 시세를 갱신할 때 호출하는 공통 함수명과 동일하게 선언.
    // premium은 loadPriceAndStock()에서 시트를 받아온 뒤 채워진다.
    let _coinPremium = null;

    function updateCardPricesFromSheet(krwPerOz) {
      if (_coinPremium === null) return; // 아직 시트 로딩 전
      const price = Math.round(krwPerOz * _coinPremium / 1000) * 1000;
      const priceEl = document.getElementById('detail-price-value');
      if (priceEl) {
        priceEl.textContent = \`₩\${price.toLocaleString()}\`;
        priceEl.classList.remove('loading');
      }
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

        if (isAvailable && isSameDay) document.getElementById('stock-badge').style.display = '';
        if (isAvailable && !isSameDay) document.getElementById('presale-badge').style.display = '';

        if (!isAvailable) {
          document.getElementById('detail-soldout-wrap').style.display = '';
          document.getElementById('inquiry-btn').outerHTML =
            '<div style="text-align:center;padding:12px 0;"><span class="soldout-badge">현재 품절된 상품입니다</span></div>';
        }

        // nav.js의 tb-gold/tb-rate가 이미 채워져 있으면 즉시 가격 표시.
        // 아직 안 채워진 경우엔 nav.js가 updateNavPrices() 완료 후
        // updateCardPricesFromSheet()를 직접 호출해 줌.
        const tbGold = document.getElementById('tb-gold');
        const tbRate = document.getElementById('tb-rate');
        if (tbGold && tbRate) {
          const gold = parseFloat(tbGold.textContent.replace('$', '').trim());
          const rate = parseFloat(tbRate.textContent.replace('원', '').replace(/,/g, '').trim());
          if (gold > 0 && rate > 0) updateCardPricesFromSheet(gold * rate);
        }
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

    function switchImage(index) {
      const thumbs = document.querySelectorAll('.gallery-thumb');
      const mainImg = document.getElementById('gallery-main-img');
      const noImg = document.getElementById('gallery-no-img');
      if (!mainImg) return;

      thumbs.forEach((t, i) => t.classList.toggle('active', i === index));
      const src = thumbs[index]?.querySelector('img')?.src;
      if (src) {
        mainImg.style.transition = 'opacity 0.15s ease, transform 0.3s ease';
        mainImg.style.opacity = '0';
        setTimeout(() => {
          mainImg.src = src;
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

// ── 5. sitemap.xml 생성 (고정 페이지 + 코인별 페이지) ──
function renderSitemap(coinEntries, todayStr) {
  const fixedUrls = [
    { loc: `${SITE_URL}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${SITE_URL}/coins.html`, changefreq: 'daily', priority: '0.8' },
    { loc: `${SITE_URL}/gold-price.html`, changefreq: 'daily', priority: '0.8' },
    { loc: `${SITE_URL}/contact.html`, changefreq: 'monthly', priority: '0.5' },
  ];
  const coinUrls = coinEntries.map(c => ({
    loc: `${SITE_URL}/coin-${c.slug}.html`,
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
  console.log('구글 시트에서 상품명 가져오는 중...');
  const sheetRows = await fetchSheetNames();
  console.log(`시트 상품 ${sheetRows.length}개 로드 완료`);

  const { entries, skipped } = buildCoinEntries(sheetRows);
  console.log(`코인 페이지 생성 대상: ${entries.length}개`);
  if (skipped.length > 0) {
    console.log(`\n⚠ 건너뛴 항목 ${skipped.length}개:`);
    skipped.forEach(s => console.log(`  - [${s.keywords.join(', ')}] ${s.reason}`));
  }

  let changedCount = 0;
  for (const coin of entries) {
    const filePath = path.join(ROOT, `coin-${coin.slug}.html`);
    const html = renderCoinPage(coin);
    const prev = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
    if (prev !== html) {
      fs.writeFileSync(filePath, html, 'utf8');
      changedCount++;
      console.log(`  ✓ coin-${coin.slug}.html ${prev === null ? '(신규)' : '(갱신)'}`);
    }
  }

  // KST 기준 날짜로 lastmod 기록
  const kstDate = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  const newSitemap = renderSitemap(entries, kstDate);
  const prevSitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : null;
  if (prevSitemap !== newSitemap) {
    fs.writeFileSync(sitemapPath, newSitemap, 'utf8');
    console.log('  ✓ sitemap.xml 갱신');
    changedCount++;
  }

  console.log(`\n총 ${entries.length}개 페이지 생성 대상, ${changedCount}개 파일 변경됨.`);
  // 변경 파일 수를 다음 스텝(workflow)에서 커밋 여부 판단에 쓸 수 있도록 출력
  console.log(`::set-output name=changed::${changedCount}`);
}

main().catch(err => {
  console.error('생성 스크립트 오류:', err);
  process.exit(1);
});
