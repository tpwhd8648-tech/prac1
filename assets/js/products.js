// =====================================================================
// products.js — index.html(메인) / coins.html(금화보기) 공용 상품 로직
//
// script.js와 coins.html에 중복돼 있던 다음 항목을 이 파일로 통합함:
//   - getCategoryFilter()
//   - createProductCard()
//   - loadProducts() (구글 시트 연동 — A~J 컬럼 전체를 공통으로 읽음)
//
// IMAGE_MAP / getImageForProduct() / getCoinNamesForSearch()는
// coin-data.js로 분리됨 (2026-06-25 — index.html도 검색 자동완성에
// IMAGE_MAP이 필요했으나 products.js 전체를 로드하긴 부담스러워서
// 분리. 자세한 배경은 coin-data.js 상단 주석 참고).
// 이 파일을 쓰는 HTML은 반드시 <script src="coin-data.js">를
// <script src="products.js"> 앞에 먼저 로드해야 한다 — products.js가
// IMAGE_MAP/getImageForProduct를 그대로 참조하기 때문.
//
// 페이지별로 달랐던 동작은 createProductCard()/loadProducts() 호출 시
// options 객체로 옵션 처리한다(있으면 사용, 없으면 아래 기본값):
//   - linkTemplate: 카드 클릭/버튼 클릭 시 이동할 URL을 만드는 함수.
//       기본값은 coins.html (상품명을 쿼리로 넘기지 않는 메인페이지 방식).
//       (product) => string 형태로 전달.
//   - loadingPriceText: 가격(KRW) 아직 안 불러왔을 때 표시할 텍스트.
//       기본값 '' (메인페이지 방식). coins.html은 '로딩중...'을 넘김.
//   - lazyImage: <img> 태그에 loading="lazy" 속성을 붙일지 여부.
//       기본값 false (메인페이지 방식). coins.html은 true를 넘김.
//   - visibleValues: 구글 시트 visible 컬럼에서 이 페이지에 보여줄 값들.
//       기본값 ['all', 'main']. coins.html은 ['all', 'coins']를 넘김.
//   - sortFn: productsData 배열을 정렬할 함수. 기본값 없음(시트 순서 그대로).
//       coins.html은 재고순 + order 필드로 정렬하는 함수를 넘김.
//
// image 컬럼(row.c[8])은 coin-detail.html에서만 실제로 쓰이지만, 다른
// 페이지에서도 일관되게 읽어두면(쓰지 않더라도) 나중에 카드에 image를
// 노출하고 싶을 때 시트 파싱 로직을 또 건드릴 필요가 없다. 즉 "있으면
// 쓰고 없으면 무시"하는 옵션 필드로 취급한다 — productsData에는 들어있지만
// createProductCard()는 현재 image를 렌더링하지 않는다(필요해지면 그때 추가).
// (2026-06-24: description 컬럼은 시트에서 삭제됨 — "추후 예정" placeholder만
//  들어있던 미사용 컬럼이었음. 이에 따라 image 컬럼 인덱스가 9→8로 당겨짐)
// =====================================================================

function getCategoryFilter(category) {
  const map = {
    'gold_1oz': 'gold',
    'gold':     'gold',
    'silver_1oz': 'silver',
    'silver':   'silver',
    'collectible': 'collectible',
    'other':    'other',
    'accessories': 'accessories',
    'merchandise': 'merchandise',
  };
  return map[category] || category;
}

// ===== 상품 카드 HTML 생성 =====
// options:
//   - linkTemplate(product): 이동할 URL 문자열을 반환하는 함수
//   - loadingPriceText: 가격 미로딩 시 표시 텍스트
//   - lazyImage: true면 <img loading="lazy"> 적용
function createProductCard(product, krwPrice, options) {
  const opts = options || {};
  const linkTemplate = opts.linkTemplate || (() => 'coins.html');
  const loadingPriceText = opts.loadingPriceText !== undefined ? opts.loadingPriceText : '';
  const lazyImage = !!opts.lazyImage;

  const { name, brand, category, premium, available, same_day } = product;
  const imgSrc = getImageForProduct(name);
  const filterCategory = getCategoryFilter(category);
  const linkUrl = linkTemplate(product);
  const isSameDay = same_day === 'TRUE' || same_day === true;

  const price = krwPrice
    ? `₩${(Math.round(krwPrice * premium / 1000) * 1000).toLocaleString()}`
    : loadingPriceText;

  const lazyAttr = lazyImage ? ' loading="lazy"' : '';
  const imgHTML = imgSrc
    ? `<img src="${imgSrc}" alt="${name}"${lazyAttr} onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';

  const placeholderHTML = `
    <div class="product-img-placeholder" style="${imgSrc ? 'display:none' : 'display:flex'}">
      <span>${name.substring(0, 6)}</span>
    </div>`;

  const isAvailable = available === 'TRUE' || available === true;

  let btnHTML;
  if (!isAvailable) {
    btnHTML = `<button class="btn-cart btn-soldout" onclick="event.stopPropagation(); location.href='${linkUrl}'">${opts.soldoutBtnText || '품절'}</button>`;
  } else {
    btnHTML = `<button class="btn-cart btn-buy" onclick="event.stopPropagation(); location.href='${linkUrl}'">상품 보기</button>`;
  }

  return `
    <div class="product-card ${!isAvailable ? 'card-soldout' : ''}" data-category="${filterCategory}" data-brand="${brand}" data-premium="${premium}"
      onclick="location.href='${linkUrl}'">
      <div class="product-img-area">
        ${imgHTML}
        ${placeholderHTML}
        ${isAvailable && isSameDay ? '<span class="badge-instock">IN STOCK</span>' : ''}
        ${isAvailable && !isSameDay ? '<span class="badge-presale">PRE SALE</span>' : ''}
        ${!isAvailable ? '<span class="badge-soldout">SOLD OUT</span>' : ''}
      </div>
      <div class="product-info">
        <p class="product-brand">${brand}</p>
        <h3 class="product-name">${name}</h3>
        <div class="product-price-wrap">
          <span class="product-price card-price">${isAvailable ? price : '품절'}</span>
        </div>
        <div class="btn-cart-wrap">
          ${btnHTML}
        </div>
      </div>
    </div>`;
}

// ===== 구글 시트 연동 =====
// 공통 SHEET_ID. row.c[7](order), row.c[8](image)는
// 시트에 없으면 undefined/빈값으로 채워지므로 안전하게 옵션 필드로 동작한다.
// (2026-06-24: description 컬럼은 시트에서 삭제됨 — 미사용 placeholder였음.
//  이에 따라 image 컬럼 인덱스가 9→8로 한 칸 당겨짐)
const SHEET_ID = '1gMqKhtWwTAizoBGlrGDpm6sl5c6vmbotGzg3qXl16-w';

// options:
//   - visibleValues: 이 페이지에서 보여줄 visible 컬럼 값 배열 (기본 ['all','main'])
//   - includeAll: true면 visible 필터를 적용하지 않고 전체 상품을 반환한다.
//       (coin-detail.html처럼 목록 노출 여부와 무관하게 상품 1개를 이름으로
//       찾아야 하는 페이지용 — visibleValues 목록을 일일이 맞출 필요가 없다.)
async function fetchProductsFromSheet(options) {
  const opts = options || {};
  const visibleValues = opts.visibleValues || ['all', 'main'];
  const includeAll = !!opts.includeAll;

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=상품`;
  const res = await fetch(url);
  const text = await res.text();
  const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/)[1]);

  const rows = json.table.rows;
  return rows.map(row => ({
    name:        row.c[0]?.v || '',
    brand:       row.c[1]?.v || '',
    category:    row.c[2]?.v || 'gold',
    premium:     parseFloat(row.c[3]?.v) || 1.03,
    available:   String(row.c[4]?.v).toUpperCase(),
    same_day:    String(row.c[5]?.v).toUpperCase(),
    visible:     row.c[6] ? String(row.c[6].v ?? 'all').toLowerCase() : 'all',
    order:       row.c[7] ? parseInt(row.c[7].v) || 9999 : 9999,
    image:       row.c[8]?.v || '',
  })).filter(p => p.name && (includeAll || visibleValues.includes(p.visible)));
}
