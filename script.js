// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

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
document.querySelector('.nav-btn-cart').addEventListener('click', openCart);

function getCardPrice(btn) {
  const card = btn.closest('.product-card');
  const priceEl = card.querySelector('.card-price');
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
  btn.classList.add('added');
  setTimeout(() => {
    btn.textContent = '장바구니 담기';
    btn.classList.remove('added');
  }, 2000);
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
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" width="48" height="48">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <p>장바구니가 비어있습니다</p>
      </div>`;
    footerEl.style.display = 'none';
  } else {
    itemsEl.innerHTML = cart.map((item, i) => `
      <div class="cart-item">
        <div class="cart-item-name">${item.name}${item.qty > 1 ? ` × ${item.qty}` : ''}</div>
        <div class="cart-item-price">₩${(item.price * item.qty).toLocaleString()}</div>
        <button class="cart-item-remove" onclick="removeFromCart(${i})" aria-label="삭제">✕</button>
      </div>`).join('');
    footerEl.style.display = 'block';
  }
}

function handleCheckout() {
  showToast('전문 상담사에게 연결 중입니다...');
  setTimeout(() => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    closeCart();
  }, 800);
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== FILTER TABS =====
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
    });
  });
});

// ===== 구글 시트 연동 =====
const SHEET_ID = '1gMqKhtWwTAizoBGlrGDpm6sl5c6vmbotGzg3qXl16-w';
let currentKrwPerOz = 0;

async function updatePrices() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=계산`;
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/)[1]);
    const row = json.table.rows[0].c;

    const xauPrice = row[0]?.v;  // A2: 달러/oz
    const krwPrice = row[3]?.v;  // D2: 원화/oz

    if (xauPrice) {
      const xauEl = document.getElementById('xau-price');
      const xauChange = document.getElementById('xau-change');
      if (xauEl) xauEl.textContent = `$${Number(xauPrice).toFixed(2)}/oz`;
      if (xauChange) { xauChange.textContent = '실시간'; xauChange.className = 'ticker-change up'; }

      const chartPrice = document.getElementById('chart-price');
      if (chartPrice) chartPrice.textContent = `$${Number(xauPrice).toFixed(2)}`;
    }

    if (krwPrice) {
      currentKrwPerOz = krwPrice;
      const pricePerGram = Math.round(krwPrice / 31.1035);

      const goldEl = document.getElementById('gold-price');
      const goldChange = document.getElementById('gold-change');
      if (goldEl) goldEl.textContent = `₩${pricePerGram.toLocaleString()}/g`;
      if (goldChange) { goldChange.textContent = '실시간'; goldChange.className = 'ticker-change up'; }

      updateCardPrices(krwPrice);
    }

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
      price = Math.round((krwPerOz / OZ) * grams * premium);
    } else {
      price = Math.round(krwPerOz * premium);
    }

    const priceEl = card.querySelector('.card-price');
    if (priceEl) priceEl.textContent = `₩${price.toLocaleString()}`;
  });
}

updatePrices();
setInterval(updatePrices, 30000);

// 티커 무한 스크롤
const tickerItems = document.getElementById('ticker-items');
if (tickerItems) tickerItems.innerHTML += tickerItems.innerHTML;

// ===== CONTACT FORM =====
function handleSubmit(e) {
  e.preventDefault();
  showToast('상담 신청이 접수되었습니다. 빠른 시간 내 연락드리겠습니다.');
  e.target.reset();
}

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card, .cert-card, .testimonial-card, .about-num, .collection-card, .why-list li').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease';
  observer.observe(el);
});

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});
