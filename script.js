// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
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

document.getElementById('slider-prev').addEventListener('click', () => goToSlide(currentSlide - 1));
document.getElementById('slider-next').addEventListener('click', () => goToSlide(currentSlide + 1));
dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

// 자동 슬라이드 5초
let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
document.querySelector('.hero-slider').addEventListener('mouseenter', () => clearInterval(autoSlide));
document.querySelector('.hero-slider').addEventListener('mouseleave', () => {
  autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
});

// 터치 스와이프
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

// ===== 구글 시트 연동 =====
// 시트 구조: A=Gold_USD, B=Silver_USD, C=Platinum_USD, D=Update_Time, E=Exchange_Rate
const SHEET_ID = '1gMqKhtWwTAizoBGlrGDpm6sl5c6vmbotGzg3qXl16-w';

async function updatePrices() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=계산`;
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/)[1]);
    const row = json.table.rows[0].c;

    const goldPrice    = row[0]?.v;  // A2: 금 USD/oz
    const silverPrice  = row[1]?.v;  // B2: 은 USD/oz
    const platPrice    = row[2]?.v;  // C2: 백금 USD/oz
    const exchangeRate = row[4]?.v;  // E2: 환율 (USD→KRW)
    const krwPrice     = (goldPrice && exchangeRate) ? goldPrice * exchangeRate : null;

    // 탑바 업데이트
    if (goldPrice)   document.getElementById('tb-gold').textContent     = `$${Number(goldPrice).toFixed(2)}`;
    if (silverPrice) document.getElementById('tb-silver').textContent   = `$${Number(silverPrice).toFixed(2)}`;
    if (platPrice)   document.getElementById('tb-platinum').textContent = `$${Number(platPrice).toFixed(2)}`;

    // 상품 카드 가격 업데이트
    if (krwPrice) updateCardPrices(krwPrice);

  } catch (e) {
    console.error('구글 시트 연동 오류:', e);
  }
}

function updateCardPrices(krwPerOz) {
  const OZ = 31.1035;
  document.querySelectorAll('.product-card').forEach(card => {
    const premium = parseFloat(card.dataset.premium) || 1.03;
    const grams = parseFloat(card.dataset.grams);
    let price;

    if (grams) {
      price = Math.round((krwPerOz / OZ) * grams * premium / 1000) * 1000;
    } else {
      price = Math.round(krwPerOz * premium / 1000) * 1000;
    }

    const priceEl = card.querySelector('.product-price');
    if (priceEl) priceEl.textContent = `₩${price.toLocaleString()}`;
  });
}

updatePrices();
setInterval(updatePrices, 30000);

// ===== HEADER SCROLL SHADOW =====
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  header.style.boxShadow = window.scrollY > 10
    ? '0 4px 16px rgba(0,0,0,0.12)'
    : '0 2px 8px rgba(0,0,0,0.06)';
}, { passive: true });

// ===== SCROLL ANIMATIONS =====
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

document.querySelectorAll('.product-card, .brand-card, .cat-banner').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s, border-color 0.2s';
  observer.observe(el);
});

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
