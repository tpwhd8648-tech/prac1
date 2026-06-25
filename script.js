// ===== HERO SLIDER =====
// initHeroSlider()로 감싸서 DOM 조회를 "로드 시점"이 아닌 "호출 시점"으로
// 늦춘다. index.html의 인라인 스크립트가 .slide/.dot을 동적으로 먼저
// 채워 넣는 구조라, 두 스크립트의 로드 순서가 바뀌면(script.js를 head로
// 옮기거나 defer를 걸거나 합치는 등) querySelectorAll이 빈 NodeList를
// 캡처해 슬라이더가 조용히 멈출 수 있었음. 이 함수는 .hero-slider가
// 없으면(다른 페이지) 그냥 종료하고, 있으면 매번 새로 슬라이드를
// 조회하므로 로드 순서·재호출 어느 쪽에도 안전하다.
function initHeroSlider() {
  const heroSlider = document.querySelector('.hero-slider');
  if (!heroSlider) return; // 이 페이지에 슬라이더 자체가 없으면 종료

  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const track = document.getElementById('slider-track');
  const totalSlides = slides.length;
  if (!track || totalSlides === 0) return; // 슬라이드가 아직 없으면 종료(0으로 나누기 방지)

  function goToSlide(n) {
    currentSlide = (n + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

  let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
  heroSlider.addEventListener('mouseenter', () => clearInterval(autoSlide));
  heroSlider.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
  });

  let touchStartX = 0;
  heroSlider.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  });
  heroSlider.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
  });
}

// DOM 준비 상태에 따라 즉시 또는 DOMContentLoaded 이후 실행 —
// script.js가 head로 옮겨지거나 defer가 걸려도 항상 안전하게 동작.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroSlider);
} else {
  initHeroSlider();
}

// ===== 장바구니/TOAST 관련 함수: 장바구니 사이드바 제거에 따라
// 함께 삭제함 (openCart/closeCart/getCardPrice/addToCart/removeFromCart/
// updateCartUI/showToast — 모두 호출하는 곳이 없던 죽은 코드였음)
// IMAGE_MAP, getImageForProduct, getCategoryFilter, createProductCard,
// SHEET_ID, fetchProductsFromSheet는 products.js(공용 파일)로 이동함.
// (2026-06-25: index.html은 더 이상 이 함수들을 쓰지 않아 products.js
//  로드를 제거함 — coins.html/coin-*.html은 여전히 사용 중이므로 그대로 둠)

// ===== 메인페이지 상품 카드: SSG(GitHub Actions)가 만든 정적 카드를
// 그대로 사용한다. 예전에는 loadProducts()가 페이지 로드 시 구글
// 시트를 fetch해 grid.innerHTML을 통째로 새로 그렸는데, 이 때문에
// 크롤러가 보는 최초 HTML(SSG 정적 카드)이 로드 직후 JS가 다시 그린
// 카드로 즉시 교체되어 SSG의 SEO 효과가 무력화되는 문제가 있었음.
// 가격만 시세에 맞춰 갱신하면 되므로, 카드 구조는 그대로 두고
// updateCardPricesFromSheet()(nav.js가 실시간 시세 수신 시 호출)로
// 가격 텍스트만 갈아끼운다. 새 코인 추가/숨김/순서 변경은 시트 수정
// 후 GitHub Actions 재실행으로 반영한다.
function updateCardPricesFromSheet(krwPerOz) {
  document.querySelectorAll('.product-card').forEach(card => {
    const premium = parseFloat(card.dataset.premium) || 1.03;
    const price = Math.round(krwPerOz * premium / 1000) * 1000;
    const priceEl = card.querySelector('.product-price');
    if (priceEl) priceEl.textContent = `₩${price.toLocaleString()}`;
  });
}

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

applyScrollAnimation(document.querySelectorAll('.product-card'));
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
