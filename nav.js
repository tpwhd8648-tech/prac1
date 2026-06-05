(function () {

  /* ── 스타일 주입 (구 nav.css) ── */
  const style = document.createElement('style');
  style.textContent = `
    .logo-wrap { display:flex; align-items:center; gap:14px; text-decoration:none; }
    .logo-symbol { flex-shrink:0; width:54px; height:54px; }
    .logo-text-block { display:flex; flex-direction:column; gap:2px; }
    .logo-brand { font-family:'Cinzel',serif; font-size:22px; font-weight:700; letter-spacing:4px; line-height:1; background:linear-gradient(135deg,#C8A84B 0%,#F5E090 40%,#C8A84B 60%,#9A7B2E 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .logo-sub-kr { font-family:'Noto Serif KR',serif; font-size:10px; letter-spacing:3px; color:#B8960C; font-weight:400; }
    .custom-dropdown { position:relative; }
    .custom-dropdown-btn {
      display:flex; align-items:center; gap:8px;
      background:transparent; color:#333;
      border:1px solid #ccc; border-radius:6px;
      padding:6px 12px; font-family:'Noto Serif KR',serif;
      font-size:13px; letter-spacing:1px; cursor:pointer;
      outline:none; white-space:nowrap;
      transition: border-color 0.2s;
    }
    .custom-dropdown-btn svg { transition: transform 0.2s; }
    .custom-dropdown-btn.open { border-color:#C8A84B; color:#C8A84B; }
    .custom-dropdown-btn.open svg { transform:rotate(180deg); }
    .custom-dropdown-menu {
      display:none; position:absolute; top:calc(100% + 6px); left:0;
      background:#fff; border:1px solid #C8A84B; border-radius:6px;
      overflow:hidden; z-index:9999; min-width:130px;
      box-shadow:0 4px 16px rgba(0,0,0,0.1);
    }
    .custom-dropdown-menu.open { display:block; }
    .custom-dropdown-item {
      display:block; padding:10px 16px;
      font-family:'Noto Serif KR',serif; font-size:13px;
      color:#333; text-decoration:none; letter-spacing:1px;
      transition:background 0.15s, color 0.15s;
    }
    .custom-dropdown-item:hover { background:#fdf6e3; color:#C8A84B; }
    .mobile-menu-close {
      position:absolute; top:16px; right:20px;
      background:none; border:none; color:#fff;
      font-size:28px; cursor:pointer; line-height:1;
      padding:4px 8px;
    }
  `;
  document.head.appendChild(style);

  const page = location.pathname.split('/').pop() || 'index.html';

  function isActive(href) {
    return page === href ? ' active' : '';
  }

  /* ── Top Bar ── */
  const topBar = document.getElementById('nav-topbar');
  if (topBar) {
    topBar.innerHTML = `
      <div class="top-bar-inner">
        <div class="top-bar-prices">
          <span class="price-item">금 <span class="price-val gold" id="tb-gold">로딩중</span></span>
          <span class="price-item">은 <span class="price-val silver" id="tb-silver">로딩중</span></span>
          <span class="price-item">백금 <span class="price-val platinum" id="tb-platinum">로딩중</span></span>
          <span class="price-item">환율 <span class="price-val" id="tb-rate" style="color:#a0c4ff;">로딩중</span></span>
        </div>
      </div>`;
  }

  /* ── Header ── */
  const header = document.getElementById('nav-header');
  if (header) {
    header.className = 'header';
    header.innerHTML = `
      <div class="header-inner">
        <a href="index.html" class="logo-wrap">
          <svg class="logo-symbol" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="petal1" cx="50%" cy="20%" r="70%"><stop offset="0%" stop-color="#F5E090"/><stop offset="50%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5C10" stop-opacity="0.7"/></radialGradient>
              <radialGradient id="petal2" cx="80%" cy="20%" r="70%"><stop offset="0%" stop-color="#F5E090"/><stop offset="50%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5C10" stop-opacity="0.7"/></radialGradient>
              <radialGradient id="petal3" cx="80%" cy="80%" r="70%"><stop offset="0%" stop-color="#F5E090"/><stop offset="50%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5C10" stop-opacity="0.7"/></radialGradient>
              <radialGradient id="petal4" cx="50%" cy="80%" r="70%"><stop offset="0%" stop-color="#F5E090"/><stop offset="50%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5C10" stop-opacity="0.7"/></radialGradient>
              <radialGradient id="petal5" cx="20%" cy="80%" r="70%"><stop offset="0%" stop-color="#F5E090"/><stop offset="50%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5C10" stop-opacity="0.7"/></radialGradient>
              <radialGradient id="petal6" cx="20%" cy="20%" r="70%"><stop offset="0%" stop-color="#F5E090"/><stop offset="50%" stop-color="#C8A84B"/><stop offset="100%" stop-color="#7A5C10" stop-opacity="0.7"/></radialGradient>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFFDE0"/><stop offset="60%" stop-color="#F5E090"/><stop offset="100%" stop-color="#C8A84B"/></radialGradient>
            </defs>
            <ellipse cx="27" cy="16" rx="9" ry="15" fill="url(#petal1)" opacity="0.85" transform="rotate(0 27 27)"/>
            <ellipse cx="27" cy="16" rx="9" ry="15" fill="url(#petal2)" opacity="0.85" transform="rotate(60 27 27)"/>
            <ellipse cx="27" cy="16" rx="9" ry="15" fill="url(#petal3)" opacity="0.85" transform="rotate(120 27 27)"/>
            <ellipse cx="27" cy="16" rx="9" ry="15" fill="url(#petal4)" opacity="0.85" transform="rotate(180 27 27)"/>
            <ellipse cx="27" cy="16" rx="9" ry="15" fill="url(#petal5)" opacity="0.85" transform="rotate(240 27 27)"/>
            <ellipse cx="27" cy="16" rx="9" ry="15" fill="url(#petal6)" opacity="0.85" transform="rotate(300 27 27)"/>
            <circle cx="27" cy="27" r="8" fill="url(#centerGlow)"/>
            <circle cx="27" cy="27" r="8" fill="none" stroke="#C8A84B" stroke-width="0.8" opacity="0.6"/>
          </svg>
          <div class="logo-text-block">
            <span class="logo-brand">MIDAS BULLION</span>
            <span class="logo-sub-kr">금화는 미다스</span>
          </div>
        </a>
        <div class="header-search">
          <div class="search-category custom-dropdown" id="custom-dropdown">
            <button class="custom-dropdown-btn" id="dropdown-btn" type="button">
              전체
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
            <div class="custom-dropdown-menu" id="dropdown-menu">
              <a class="custom-dropdown-item" href="coins.html">금화 보기</a>
              <a class="custom-dropdown-item" href="gold-price.html">금 시세</a>
              <a class="custom-dropdown-item" href="contact.html">구매 문의</a>
            </div>
          </div>
          <input type="text" placeholder="상품 검색..." class="search-input">
          <button class="search-btn">검색</button>
        </div>
        <div class="header-icons">
          <button class="icon-btn" aria-label="장바구니" onclick="openCart()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="22" height="22"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span class="cart-count">0</span>
          </button>
          <button class="hamburger" id="hamburger"><span></span><span></span><span></span></button>
        </div>
      </div>`;

    /* ── 드롭다운 이벤트 ── */
    const btn = document.getElementById('dropdown-btn');
    const menu = document.getElementById('dropdown-menu');
    if (btn && menu) {
      let isOpen = false;

      function openDropdown(e) {
        e.stopPropagation();
        isOpen = !isOpen;
        btn.classList.toggle('open', isOpen);
        menu.classList.toggle('open', isOpen);
      }

      function closeDropdown() {
        isOpen = false;
        btn.classList.remove('open');
        menu.classList.remove('open');
      }

      btn.addEventListener('click', openDropdown);
      btn.addEventListener('touchend', function(e) {
        e.preventDefault();
        openDropdown(e);
      });

      document.addEventListener('click', function(e) {
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
          closeDropdown();
        }
      });
      document.addEventListener('touchend', function(e) {
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
          closeDropdown();
        }
      });
    }
  }

  /* ── Main Nav ── */
  const nav = document.getElementById('nav-main');
  if (nav) {
    nav.className = 'main-nav';
    nav.innerHTML = `
      <div class="nav-inner">
        <ul class="nav-list">
          <li class="nav-item"><a href="coins.html" class="nav-link${isActive('coins.html')}">금화 보기</a></li>
          <li class="nav-item"><a href="gold-price.html" class="nav-link${isActive('gold-price.html')}">금 시세</a></li>
          <li class="nav-item"><a href="contact.html" class="nav-link${isActive('contact.html')}">구매 문의</a></li>
        </ul>
      </div>`;
  }

  /* ── Mobile Menu ── */
  const mobile = document.getElementById('nav-mobile');
  if (mobile) {
    mobile.className = 'mobile-menu';
    mobile.innerHTML = `
      <button class="mobile-menu-close" id="mobile-menu-close">✕</button>
      <ul>
        <li><a href="coins.html">금화 보기</a></li>
        <li><a href="gold-price.html">금 시세</a></li>
        <li><a href="contact.html">구매 문의</a></li>
      </ul>`;
  }

  /* ── 햄버거 이벤트 (DOMContentLoaded 이후 안전하게 바인딩) ── */
  function bindHamburger() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('nav-mobile');
    const closeBtn = document.getElementById('mobile-menu-close');

    if (!hamburger || !mobileMenu) return;

    function openMenu() {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', openMenu);
    hamburger.addEventListener('touchend', function(e) {
      e.preventDefault();
      openMenu();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
      closeBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        closeMenu();
      });
    }

    // 메뉴 링크 클릭시 닫기
    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindHamburger);
  } else {
    bindHamburger();
  }

})();

// ===== 탑바 시세 업데이트 (모든 페이지 공통) =====
(function () {
  const SHEET_ID = '1gMqKhtWwTAizoBGlrGDpm6sl5c6vmbotGzg3qXl16-w';

  async function updateNavPrices() {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=계산`;
      const res = await fetch(url);
      const text = await res.text();
      const json = JSON.parse(
        text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/)[1]
      );
      const row = json.table.rows[0].c;

      const goldPrice    = row[0]?.v;
      const silverPrice  = row[1]?.v;
      const platPrice    = row[2]?.v;
      const exchangeRate = row[4]?.v;

      if (goldPrice)    document.getElementById('tb-gold').textContent     = `$${Number(goldPrice).toFixed(2)}`;
      if (silverPrice)  document.getElementById('tb-silver').textContent   = `$${Number(silverPrice).toFixed(2)}`;
      if (platPrice)    document.getElementById('tb-platinum').textContent = `$${Number(platPrice).toFixed(2)}`;
      if (exchangeRate) document.getElementById('tb-rate').textContent     = `${Number(exchangeRate).toLocaleString()}원`;

      const goldVal   = document.getElementById('gold-val');
      const silverVal = document.getElementById('silver-val');
      const rateVal   = document.getElementById('rate-val');
      if (goldVal   && goldPrice)    goldVal.textContent   = `$${Number(goldPrice).toFixed(2)}`;
      if (silverVal && silverPrice)  silverVal.textContent = `$${Number(silverPrice).toFixed(2)}`;
      if (rateVal   && exchangeRate) rateVal.textContent   = `${Number(exchangeRate).toLocaleString()}`;

      if (goldPrice && exchangeRate && typeof updateCardPricesFromSheet === 'function') {
        updateCardPricesFromSheet(goldPrice * exchangeRate);
      }

    } catch (e) {
      console.error('시세 연동 오류:', e);
    }
  }

  setTimeout(() => {
    updateNavPrices();
    setInterval(updateNavPrices, 30000);
  }, 300);
})();
