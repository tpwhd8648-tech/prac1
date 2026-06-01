// ===== CONFIG (한 곳에서만 관리) =====
const CONFIG = {
  SHEET_ID: '1gMqKhtWwTAizoBGlrGDpm6sl5c6vmbotGzg3qXl16-w',
  REFRESH_MS: 30000,
};

// ===== HAMBURGER MENU =====
// nav.js가 #hamburger, #nav-mobile을 주입한 뒤 실행되므로
// DOMContentLoaded 대신 document.addEventListener('click') 위임 방식 사용
document.addEventListener('click', function (e) {
  const btn = e.target.closest('#hamburger');
  if (!btn) return;
  const menu = document.getElementById('nav-mobile');
  if (menu) {
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  }
});

// ===== HERO SLIDER =====
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const track = document.getElementById('slider-track');
const totalSlides = slides.length;

function goToSlide(n) {
  currentSlide = (n + totalSlides) % totalSlides;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

if (track && totalSlides > 0) {
  document.getElementById('slider-prev')?.addEventListener('click', () => goToSlide(currentSlide - 1));
  document.getElementById('slider-next')?.addEventListener('click', () => goToSlide(currentSlide + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

  let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
  const heroSlider = document.querySelector('.hero-slider');
  if (heroSlider) {
    heroSlider.addEventListener('mouseenter', () => clearInterval(autoSlide));
    heroSlider.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
    });

    let touchStartX = 0;
    heroSlider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
    heroSlider.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    });
  }
}

// ===== PRODUCT TABS =====
document.querySelectorAll('.ptab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
    });
  });
});

// ===== CART =====
let cart = [];

function openCart() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function getCardPrice(btn) {
  const card = btn.closest('.product-card');
  const priceEl = card.querySelector('.product-price');
  const raw = priceEl.textContent.replace(/[₩,]/g, '').trim();
  return parseInt(raw) || 0;
}

function addToCart(btn, name, price) {
  if (!price || price === 0) {
    showToast('가격 로딩 중입니다. 잠시 후 다시 시도해주세요.');
    return;
  }
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartUI();
  showToast(`${name} 장바구니에 담겼습니다`);
  btn.textContent = '✓ 담겼습니다';
  setTimeout(() => { btn.textContent = '장바구니 담기'; }, 2000);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelector('.cart-count').textContent = count;
  document.getElementById('cart-total-price').textContent = `₩${total.toLocaleString()}`;

  const itemsEl = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty"><p>장바구니가 비어있습니다</p></div>`;
    footerEl.style.display = 'none';
  } else {
    itemsEl.innerHTML = cart.map((item, i) => `
      <div class="cart-item">
        <div class="cart-item-name">${item.name}${item.qty > 1 ? ` × ${item.qty}` : ''}</div>
        <div class="cart-item-price">₩${(item.price * item.qty).toLocaleString()}</div>
        <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>
      </div>`).join('');
    footerEl.style.display = 'block';
  }
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== 상품명 → 이미지 파일명 매핑 =====
const IMAGE_MAP = [
  { keywords: ['메이플', 'maple'],           file: 'maple-2026.png' },
  { keywords: ['브리타니아', 'britannia'],    file: 'britannia-2026.png' },
  { keywords: ['캥거루', 'kangaroo'],         file: 'kangaroo-2026.png' },
  { keywords: ['버팔로', 'buffalo'],          file: 'buffalo-2026.png' },
  { keywords: ['이글', 'eagle'],             file: 'eagle-2026.png' },
  { keywords: ['필하모닉', 'philharmonic'],   file: 'philharmonic-2026.png' },
  { keywords: ['크루거', 'krugerrand'],       file: 'krugerrand-2026.png' },
  { keywords: ['판다', 'panda'],             file: 'panda-2026.png' },
  { keywords: ['코뿔소', 'rhino'],           file: 'rhino-2026.png' },
  { keywords: ['성조지', '세인트조지', 'george'], file: 'george-2026.png' },
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
function createProductCard(product, krwPrice) {
  const { name, brand, category, premium, available, same_day } = product;
  const imgSrc = getImageForProduct(name);
  const filterCategory = getCategoryFilter(category);

  const price = krwPrice
    ? `₩${(Math.round(krwPrice * premium / 1000) * 1000).toLocaleString()}`
    : '로딩중...';

  const imgHTML = imgSrc
    ? `<img src="${imgSrc}" alt="${name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';

  const placeholderHTML = `
    <div class="product-img-placeholder" style="${imgSrc ? 'display:none' : 'display:flex'}">
      <span>${name.substring(0, 6)}</span>
    </div>`;

  const isAvailable = available === 'TRUE' || available === true;
  const isSameDay   = same_day === 'TRUE' || same_day === true;

  const badges = [];

  let btnHTML;
  if (!isAvailable) {
    btnHTML = `<button class="btn-cart btn-soldout" disabled>품절</button>`;
  } else if (isSameDay) {
    btnHTML = `<button class="btn-cart btn-sameday-buy" onclick="addToCart(this, '${name.replace(/'/g, "\\'")}', getCardPrice(this))">당일수령 가능</button>`;
  } else {
    btnHTML = `<button class="btn-cart btn-buy" onclick="addToCart(this, '${name.replace(/'/g, "\\'")}', getCardPrice(this))">구매하기</button>`;
  }

  return `
    <div class="product-card ${!isAvailable ? 'card-soldout' : ''}" data-category="${filterCategory}" data-premium="${premium}">
      <div class="product-img-area">
        ${imgHTML}
        ${placeholderHTML}
        ${badges.length ? `<div class="product-badges">${badges.join('')}</div>` : ''}
        ${!isAvailable ? '<div class="soldout-overlay"><span>SOLD OUT</span></div>' : ''}
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
let currentKrwPrice = null;
let productsData = [];

async function loadProducts() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:json&sheet=상품`;
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/)[1]);

    productsData = json.table.rows.map(row => ({
      name:      row.c[0]?.v || '',
      brand:     row.c[1]?.v || '',
      category:  row.c[2]?.v || 'gold',
      premium:   parseFloat(row.c[3]?.v) || 1.03,
      available: String(row.c[4]?.v).toUpperCase(),
      same_day:  String(row.c[5]?.v).toUpperCase(),
    })).filter(p => p.name);

    renderProducts();
  } catch (e) {
    console.error('상품 목록 로딩 오류:', e);
    const grid = document.getElementById('products-grid');
    if (grid) grid.innerHTML = '<p style="color:#888;text-align:center;padding:2rem;">상품을 불러오는 중 오류가 발생했습니다.</p>';
  }
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid || !productsData.length) return;

  grid.innerHTML = productsData
    .map(p => createProductCard(p, currentKrwPrice))
    .join('');

  const activeTab = document.querySelector('.ptab.active');
  if (activeTab) {
    const filter = activeTab.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
    });
  }

  applyScrollAnimation(document.querySelectorAll('.product-card'));
}

function updateCardPricesFromSheet(krwPerOz) {
  currentKrwPrice = krwPerOz;
  document.querySelectorAll('.product-card').forEach(card => {
    const premium = parseFloat(card.dataset.premium) || 1.03;
    const price = Math.round(krwPerOz * premium / 1000) * 1000;
    const priceEl = card.querySelector('.product-price');
    if (priceEl) priceEl.textContent = `₩${price.toLocaleString()}`;
  });
}

// ===== 시세 업데이트 (Top Bar + 카드 가격 통합) =====
async function updatePrices() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:json&sheet=계산`;
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/)[1]);
    const row = json.table.rows[0].c;

    const goldPrice    = row[0]?.v;
    const silverPrice  = row[1]?.v;
    const platPrice    = row[2]?.v;
    const exchangeRate = row[4]?.v;
    const krwPrice     = (goldPrice && exchangeRate) ? goldPrice * exchangeRate : null;

    const tbGold = document.getElementById('tb-gold');
    const tbSilver = document.getElementById('tb-silver');
    const tbPlat = document.getElementById('tb-platinum');
    const tbRate = document.getElementById('tb-rate');

    if (tbGold)   tbGold.textContent   = goldPrice    ? `$${Number(goldPrice).toFixed(2)}`            : '-';
    if (tbSilver) tbSilver.textContent = silverPrice  ? `$${Number(silverPrice).toFixed(2)}`          : '-';
    if (tbPlat)   tbPlat.textContent   = platPrice    ? `$${Number(platPrice).toFixed(2)}`            : '-';
    if (tbRate)   tbRate.textContent   = exchangeRate ? `${Number(exchangeRate).toLocaleString()}원`  : '-';

    if (krwPrice) updateCardPricesFromSheet(krwPrice);

  } catch (e) {
    console.error('시세 연동 오류:', e);
    ['tb-gold', 'tb-silver', 'tb-platinum', 'tb-rate'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '-';
    });
  }
}

// 초기 로딩
loadProducts().then(() => updatePrices());
setInterval(updatePrices, CONFIG.REFRESH_MS);

// ===== SCROLL ANIMATIONS =====
function applyScrollAnimation(els) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s, border-color 0.2s';
    observer.observe(el);
  });
}

applyScrollAnimation(document.querySelectorAll('.brand-card, .cat-banner'));

// ===== HEADER SCROLL SHADOW =====
window.addEventListener('scroll', () => {
  const header = document.getElementById('nav-header');
  if (header) {
    header.style.boxShadow = window.scrollY > 10
      ? '0 4px 16px rgba(0,0,0,0.12)'
      : '0 2px 8px rgba(0,0,0,0.06)';
  }
}, { passive: true });

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
    }
  });
});
