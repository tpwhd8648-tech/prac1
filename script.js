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

document.getElementById('slider-prev').addEventListener('click', () => goToSlide(currentSlide - 1));
document.getElementById('slider-next').addEventListener('click', () => goToSlide(currentSlide + 1));
dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
document.querySelector('.hero-slider').addEventListener('mouseenter', () => clearInterval(autoSlide));
document.querySelector('.hero-slider').addEventListener('mouseleave', () => {
  autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
});

let touchStartX = 0;
document.querySelector('.hero-slider').addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
});
document.querySelector('.hero-slider').addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
});

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
  const cartCountEl = document.querySelector('.cart-count');
  if (cartCountEl) cartCountEl.textContent = count;
  const cartTotalEl = document.getElementById('cart-total-price');
  if (cartTotalEl) cartTotalEl.textContent = `₩${total.toLocaleString()}`;

  const itemsEl = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');
  if (!itemsEl || !footerEl) return;

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
  { keywords: ['2026 메이플', '2026 maple'],                           file: 'products-maple-2026.png' },
  { keywords: ['2026 브리타니아', '2026 britannia'],                   file: 'products-britannia-2026.png' },
  { keywords: ['2026 캥거루', '2026 kangaroo'],                        file: 'products-kangaroo-2026.png' },
  { keywords: ['2026 버팔로', '2026 buffalo'],                         file: 'products-buffalo-2026.png' },
  { keywords: ['2026 이글', '2026 eagle'],                             file: 'products-eagle-2026.png' },
  { keywords: ['2026 필하모닉', '2026 philharmonic'],                  file: 'products-philharmonic-2026.png' },
  { keywords: ['2026 크루거', '2026 krugerrand'],                      file: 'products-krugerrand-2026.png' },
  { keywords: ['2026 판다', '2026 panda'],                             file: 'products-panda-2026.png' },
  { keywords: ['2026 코뿔소', '2026 rhino'],                           file: 'products-rhino-2026.png' },
  { keywords: ['2026 성조지', '2026 세인트조지', '2026 george'],       file: 'products-st-george-dragon-2026.png' },
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
  { keywords: ['2026 세인트조지드래곤', '2026 st george dragon'],      file: 'products-st-george-dragon-2026.png' },
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
  const { name, brand, category, premium, available } = product;
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

  let btnHTML;
  if (!isAvailable) {
    btnHTML = `<button class="btn-cart btn-soldout" onclick="event.stopPropagation(); location.href='coins.html'">품절</button>`;
  } else {
    btnHTML = `<button class="btn-cart btn-buy" onclick="event.stopPropagation(); location.href='coins.html'">상품 보기</button>`;
  }

  return `
    <div class="product-card ${!isAvailable ? 'card-soldout' : ''}" data-category="${filterCategory}" data-premium="${premium}"
      onclick="location.href='coins.html'">
      <div class="product-img-area">
        ${imgHTML}
        ${placeholderHTML}
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
const SHEET_ID = '1gMqKhtWwTAizoBGlrGDpm6sl5c6vmbotGzg3qXl16-w';
let currentKrwPrice = null;
let productsData = [];

async function loadProducts() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=상품`;
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/)[1]);

    const rows = json.table.rows;
    productsData = rows.map(row => ({
      name:      row.c[0]?.v || '',
      brand:     row.c[1]?.v || '',
      category:  row.c[2]?.v || 'gold',
      premium:   parseFloat(row.c[3]?.v) || 1.03,
      available: String(row.c[4]?.v).toUpperCase(),
      same_day:  String(row.c[5]?.v).toUpperCase(),
      visible:   row.c[6] ? String(row.c[6].v ?? 'all').toLowerCase() : 'all',
    })).filter(p => p.name && (p.visible === 'all' || p.visible === 'main'));

    renderProducts();
  } catch (e) {
    console.error('상품 목록 로딩 오류:', e);
    document.getElementById('products-grid').innerHTML =
      '<p style="color:#888;text-align:center;padding:2rem;">상품을 불러오는 중 오류가 발생했습니다.</p>';
  }
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!productsData.length) return;

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

loadProducts();

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

document.querySelectorAll('.brand-card, .cat-banner').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s, border-color 0.2s';
});
applyScrollAnimation(document.querySelectorAll('.brand-card, .cat-banner'));

// ===== HEADER SCROLL SHADOW =====
window.addEventListener('scroll', () => {
  const header = document.getElementById('nav-header');
  if (!header) return;
  header.style.boxShadow = window.scrollY > 10
    ? '0 4px 16px rgba(0,0,0,0.12)'
    : '0 2px 8px rgba(0,0,0,0.06)';
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
