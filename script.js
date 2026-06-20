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

// ===== 상품 카드 / 이미지 매핑 / 시트 로딩 공용 로직 =====
// IMAGE_MAP, getImageForProduct, getCategoryFilter, createProductCard,
// SHEET_ID, fetchProductsFromSheet는 products.js(공용 파일)로 이동함.
// index.html에서 products.js를 script.js보다 먼저 로드해야 함.

let currentKrwPrice = null;
let productsData = [];

// 메인페이지 전용 카드 옵션: 클릭 시 coins.html 이동(상품명 쿼리 없음),
// 가격 미로딩 시 빈 문자열 표시, lazy 이미지 미적용 — 기존 동작 그대로.
const MAIN_CARD_OPTIONS = {
  linkTemplate: () => 'coins.html',
  loadingPriceText: '',
  lazyImage: false,
};

async function loadProducts() {
  try {
    productsData = await fetchProductsFromSheet({ visibleValues: ['all', 'main'] });
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
    .map(p => createProductCard(p, currentKrwPrice, MAIN_CARD_OPTIONS))
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
  }, { threshold: 0 });

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
