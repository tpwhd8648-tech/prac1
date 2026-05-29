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

function addToCart(btn, name, price) {
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

// ===== PRICE TICKER =====
function updatePrices() {
  const goldBase = 125430, xauBase = 2387.50, silverBase = 1420;
  const goldDelta = (Math.random() - 0.48) * 200;
  const xauDelta = (Math.random() - 0.48) * 5;
  const silverDelta = (Math.random() - 0.52) * 10;

  const gEl = document.getElementById('gold-price');
  const xEl = document.getElementById('xau-price');
  const sEl = document.getElementById('silver-price');

  if (gEl) {
    gEl.textContent = `₩${(goldBase + Math.floor(goldDelta)).toLocaleString()}/g`;
    const gc = document.getElementById('gold-change');
    gc.textContent = `${goldDelta >= 0 ? '+' : ''}${((goldDelta / goldBase) * 100).toFixed(2)}%`;
    gc.className = `ticker-change ${goldDelta >= 0 ? 'up' : 'down'}`;
  }
  if (xEl) {
    xEl.textContent = `$${(xauBase + xauDelta).toFixed(2)}/oz`;
    const xc = document.getElementById('xau-change');
    xc.textContent = `${xauDelta >= 0 ? '+' : ''}${((xauDelta / xauBase) * 100).toFixed(2)}%`;
    xc.className = `ticker-change ${xauDelta >= 0 ? 'up' : 'down'}`;
  }
  if (sEl) {
    sEl.textContent = `₩${(silverBase + Math.floor(silverDelta)).toLocaleString()}/g`;
    const sc = document.getElementById('silver-change');
    sc.textContent = `${silverDelta >= 0 ? '+' : '-'}${Math.abs((silverDelta / silverBase) * 100).toFixed(2)}%`;
    sc.className = `ticker-change ${silverDelta >= 0 ? 'up' : 'down'}`;
  }
}
setInterval(updatePrices, 3000);

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
