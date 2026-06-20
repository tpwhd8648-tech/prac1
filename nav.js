// ===== Favicon 자동 적용 (파일 업로드 없이 코드에 직접 내장) =====
(function () {
  const icons = [
    { rel: 'icon', type: 'image/svg+xml', href: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTQgNTQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InBldGFsMSIgY3g9IjUwJSIgY3k9IjIwJSIgcj0iNzAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRjVFMDkwIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiNDOEE4NEIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM3QTVDMTAiIHN0b3Atb3BhY2l0eT0iMC43Ii8+PC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0icGV0YWwyIiBjeD0iODAlIiBjeT0iMjAlIiByPSI3MCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGNUUwOTAiLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iI0M4QTg0QiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzdBNUMxMCIgc3RvcC1vcGFjaXR5PSIwLjciLz48L3JhZGlhbEdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJwZXRhbDMiIGN4PSI4MCUiIGN5PSI4MCUiIHI9IjcwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0Y1RTA5MCIvPjxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjQzhBODRCIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjN0E1QzEwIiBzdG9wLW9wYWNpdHk9IjAuNyIvPjwvcmFkaWFsR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InBldGFsNCIgY3g9IjUwJSIgY3k9IjgwJSIgcj0iNzAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRjVFMDkwIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiNDOEE4NEIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM3QTVDMTAiIHN0b3Atb3BhY2l0eT0iMC43Ii8+PC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0icGV0YWw1IiBjeD0iMjAlIiBjeT0iODAlIiByPSI3MCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGNUUwOTAiLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iI0M4QTg0QiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzdBNUMxMCIgc3RvcC1vcGFjaXR5PSIwLjciLz48L3JhZGlhbEdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJwZXRhbDYiIGN4PSIyMCUiIGN5PSIyMCUiIHI9IjcwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0Y1RTA5MCIvPjxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjQzhBODRCIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjN0E1QzEwIiBzdG9wLW9wYWNpdHk9IjAuNyIvPjwvcmFkaWFsR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9ImNlbnRlckdsb3ciIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjUwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGRkRFMCIvPjxzdG9wIG9mZnNldD0iNjAlIiBzdG9wLWNvbG9yPSIjRjVFMDkwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQzhBODRCIi8+PC9yYWRpYWxHcmFkaWVudD4KICA8L2RlZnM+CiAgPGVsbGlwc2UgY3g9IjI3IiBjeT0iMTYiIHJ4PSI5IiByeT0iMTUiIGZpbGw9InVybCgjcGV0YWwxKSIgb3BhY2l0eT0iMC44NSIgdHJhbnNmb3JtPSJyb3RhdGUoMCAyNyAyNykiLz4KICA8ZWxsaXBzZSBjeD0iMjciIGN5PSIxNiIgcng9IjkiIHJ5PSIxNSIgZmlsbD0idXJsKCNwZXRhbDIpIiBvcGFjaXR5PSIwLjg1IiB0cmFuc2Zvcm09InJvdGF0ZSg2MCAyNyAyNykiLz4KICA8ZWxsaXBzZSBjeD0iMjciIGN5PSIxNiIgcng9IjkiIHJ5PSIxNSIgZmlsbD0idXJsKCNwZXRhbDMpIiBvcGFjaXR5PSIwLjg1IiB0cmFuc2Zvcm09InJvdGF0ZSgxMjAgMjcgMjcpIi8+CiAgPGVsbGlwc2UgY3g9IjI3IiBjeT0iMTYiIHJ4PSI5IiByeT0iMTUiIGZpbGw9InVybCgjcGV0YWw0KSIgb3BhY2l0eT0iMC44NSIgdHJhbnNmb3JtPSJyb3RhdGUoMTgwIDI3IDI3KSIvPgogIDxlbGxpcHNlIGN4PSIyNyIgY3k9IjE2IiByeD0iOSIgcnk9IjE1IiBmaWxsPSJ1cmwoI3BldGFsNSkiIG9wYWNpdHk9IjAuODUiIHRyYW5zZm9ybT0icm90YXRlKDI0MCAyNyAyNykiLz4KICA8ZWxsaXBzZSBjeD0iMjciIGN5PSIxNiIgcng9IjkiIHJ5PSIxNSIgZmlsbD0idXJsKCNwZXRhbDYpIiBvcGFjaXR5PSIwLjg1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMDAgMjcgMjcpIi8+CiAgPGNpcmNsZSBjeD0iMjciIGN5PSIyNyIgcj0iOCIgZmlsbD0idXJsKCNjZW50ZXJHbG93KSIvPgogIDxjaXJjbGUgY3g9IjI3IiBjeT0iMjciIHI9IjgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0M4QTg0QiIgc3Ryb2tlLXdpZHRoPSIwLjgiIG9wYWNpdHk9IjAuNiIvPgo8L3N2Zz4K' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: 'data:image/png;base64,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' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: 'data:image/png;base64,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' },
  ];
  icons.forEach(function (attrs) {
    const link = document.createElement('link');
    Object.keys(attrs).forEach(function (k) { link.setAttribute(k, attrs[k]); });
    document.head.appendChild(link);
  });
})();


(function () {

  /* ── 스타일 주입 (구 nav.css) ── */
  const style = document.createElement('style');
  style.textContent = `
    .logo-wrap { display:flex; align-items:center; gap:14px; text-decoration:none; min-width:0; }
    .logo-symbol { flex-shrink:0; width:54px; height:54px; }
    .logo-text-block { display:flex; flex-direction:column; gap:2px; min-width:0; overflow:hidden; }
    .logo-brand { font-family:'Cinzel',serif; font-size:22px; font-weight:700; letter-spacing:4px; line-height:1; background:linear-gradient(135deg,#C8A84B 0%,#F5E090 40%,#C8A84B 60%,#9A7B2E 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .logo-sub-kr { font-family:'Noto Serif KR',serif; font-size:10px; letter-spacing:3px; color:#B8960C; font-weight:400; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    @media (max-width: 400px) {
      .logo-symbol { width:40px; height:40px; }
      .logo-wrap { gap:10px; }
      .logo-brand { font-size:18px; letter-spacing:2px; }
      .logo-sub-kr { font-size:9px; letter-spacing:1.5px; }
      .header-icons { gap:2px; }
      .icon-btn { padding:6px; }
    }
    .custom-dropdown { position:relative; }
    .custom-dropdown-btn {
      display:flex; align-items:center; gap:8px;
      background:transparent; color:#333;
      border:1px solid #ccc; border-radius:6px;
      padding:0 12px;
      height:44px;
      box-sizing:border-box;
      font-family:'Noto Serif KR',serif;
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

    /* ── Shimmer 공통 ── */
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position:  400px 0; }
    }
    /* 탑바용 shimmer (어두운 배경) */
    .shimmer-bar {
      display: inline-block;
      border-radius: 4px;
      background: linear-gradient(90deg, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.08) 75%);
      background-size: 800px 100%;
      animation: shimmer 1.4s infinite;
      vertical-align: middle;
      width: 56px; height: 13px;
    }
    /* 금시세 카드용 shimmer (밝은 배경) */
    .shimmer-card-line {
      display: block;
      border-radius: 4px;
      background: linear-gradient(90deg, #ede8da 25%, #f5f0e6 50%, #ede8da 75%);
      background-size: 800px 100%;
      animation: shimmer 1.4s infinite;
    }
    .shimmer-card-lg { width: 75%; height: 28px; }
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
          <span class="price-item">금 <span class="price-val gold" id="tb-gold"><span class="shimmer-bar"></span></span></span>
          <span class="price-item">은 <span class="price-val silver" id="tb-silver"><span class="shimmer-bar"></span></span></span>
          <span class="price-item">백금 <span class="price-val platinum" id="tb-platinum"><span class="shimmer-bar"></span></span></span>
          <span class="price-item">환율 <span class="price-val" id="tb-rate" style="color:#a0c4ff;"><span class="shimmer-bar"></span></span></span>
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
          <button class="icon-btn auth-btn auth-btn-pending" id="auth-btn" aria-label="로그인">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="22" height="22"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span class="auth-btn-label">로그인</span>
          </button>
          <button class="icon-btn" aria-label="장바구니" onclick="typeof openCart === 'function' && openCart()">
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
      let justToggled = false;

      function openDropdown() {
        isOpen = !isOpen;
        btn.classList.toggle('open', isOpen);
        menu.classList.toggle('open', isOpen);
      }

      function closeDropdown() {
        isOpen = false;
        btn.classList.remove('open');
        menu.classList.remove('open');
      }

      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        openDropdown();
      });

      btn.addEventListener('touchend', function(e) {
        e.preventDefault();
        justToggled = true;
        openDropdown();
        setTimeout(() => { justToggled = false; }, 0);
      });

      document.addEventListener('click', function(e) {
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
          closeDropdown();
        }
      });

      document.addEventListener('touchend', function(e) {
        if (justToggled) return;
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
        <li><a href="#" id="mobile-auth-link" class="auth-btn-pending">로그인</a></li>
      </ul>`;
  }

  /* ── 햄버거 이벤트 ── */
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

// ===== 로그인 / 회원가입 모달 + 인증 상태 토글 =====
(function () {

  /* ── 모달 DOM 생성 (최초 1회) ── */
  function ensureAuthModal() {
    if (document.getElementById('auth-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'auth-modal-overlay';
    overlay.className = 'auth-modal-overlay';
    overlay.innerHTML = `
      <div class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <button class="auth-modal-close" id="auth-modal-close" aria-label="닫기">✕</button>
        <div class="auth-tabs">
          <button class="auth-tab active" id="auth-tab-signin" type="button">로그인</button>
          <button class="auth-tab" id="auth-tab-signup" type="button">회원가입</button>
        </div>
        <h2 id="auth-modal-title" class="auth-modal-title">MIDAS BULLION 로그인</h2>
        <form id="auth-form" class="auth-form" novalidate>
          <label class="auth-field">
            <span>이메일</span>
            <input type="email" id="auth-email" autocomplete="email" required placeholder="example@email.com">
          </label>
          <label class="auth-field">
            <span>비밀번호</span>
            <input type="password" id="auth-password" autocomplete="current-password" required placeholder="6자 이상 입력">
          </label>
          <label class="auth-field auth-field-confirm" id="auth-confirm-wrap" style="display:none;">
            <span>비밀번호 확인</span>
            <input type="password" id="auth-password-confirm" autocomplete="new-password" placeholder="비밀번호를 한 번 더 입력">
          </label>
          <div class="auth-error" id="auth-error" role="alert"></div>
          <button type="submit" class="auth-submit-btn" id="auth-submit-btn">로그인</button>
        </form>
      </div>`;
    document.body.appendChild(overlay);

    /* ── 엘리먼트 참조 ── */
    const form = overlay.querySelector('#auth-form');
    const emailInput = overlay.querySelector('#auth-email');
    const passwordInput = overlay.querySelector('#auth-password');
    const confirmWrap = overlay.querySelector('#auth-confirm-wrap');
    const confirmInput = overlay.querySelector('#auth-password-confirm');
    const errorBox = overlay.querySelector('#auth-error');
    const submitBtn = overlay.querySelector('#auth-submit-btn');
    const title = overlay.querySelector('#auth-modal-title');
    const tabSignin = overlay.querySelector('#auth-tab-signin');
    const tabSignup = overlay.querySelector('#auth-tab-signup');
    const closeBtn = overlay.querySelector('#auth-modal-close');

    let mode = 'signin'; // 'signin' | 'signup'

    function clearError() {
      errorBox.textContent = '';
      errorBox.classList.remove('show');
    }

    function showError(message) {
      errorBox.textContent = message;
      errorBox.classList.add('show');
    }

    function setMode(newMode) {
      mode = newMode;
      clearError();
      form.reset();
      if (mode === 'signup') {
        tabSignup.classList.add('active');
        tabSignin.classList.remove('active');
        title.textContent = 'MIDAS BULLION 회원가입';
        passwordInput.autocomplete = 'new-password';
        confirmWrap.style.display = 'flex';
        submitBtn.textContent = '회원가입';
      } else {
        tabSignin.classList.add('active');
        tabSignup.classList.remove('active');
        title.textContent = 'MIDAS BULLION 로그인';
        passwordInput.autocomplete = 'current-password';
        confirmWrap.style.display = 'none';
        submitBtn.textContent = '로그인';
      }
    }

    tabSignin.addEventListener('click', () => setMode('signin'));
    tabSignup.addEventListener('click', () => setMode('signup'));

    function closeModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      clearError();
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });

    /* ── Firebase Auth 에러 코드 → 한국어 메시지 ── */
    function translateAuthError(err) {
      const code = err && err.code;
      switch (code) {
        case 'auth/invalid-email':
          return '올바른 이메일 형식이 아닙니다.';
        case 'auth/missing-password':
          return '비밀번호를 입력해 주세요.';
        case 'auth/weak-password':
          return '비밀번호는 6자 이상이어야 합니다.';
        case 'auth/email-already-in-use':
          return '이미 가입된 이메일입니다. 로그인을 이용해 주세요.';
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          return '이메일 또는 비밀번호가 일치하지 않습니다.';
        case 'auth/too-many-requests':
          return '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해 주세요.';
        case 'auth/network-request-failed':
          return '네트워크 연결을 확인해 주세요.';
        default:
          return '처리 중 문제가 발생했습니다. 다시 시도해 주세요.';
      }
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      clearError();

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!window.bullionAuth) {
        showError('인증 모듈을 불러오지 못했습니다. 페이지를 새로고침해 주세요.');
        return;
      }

      if (mode === 'signup') {
        const confirm = confirmInput.value;
        if (password.length < 6) {
          showError('비밀번호는 6자 이상이어야 합니다.');
          return;
        }
        if (password !== confirm) {
          showError('비밀번호가 일치하지 않습니다.');
          return;
        }
      }

      submitBtn.disabled = true;
      submitBtn.classList.add('loading');

      try {
        if (mode === 'signup') {
          await window.bullionAuth.signUp(email, password);
        } else {
          await window.bullionAuth.signIn(email, password);
        }
        closeModal();
      } catch (err) {
        showError(translateAuthError(err));
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
      }
    });

    /* setMode 함수를 외부(openAuthModal)에서도 쓸 수 있게 보관 */
    overlay._setMode = setMode;
  }

  function openAuthModal(mode) {
    ensureAuthModal();
    const overlay = document.getElementById('auth-modal-overlay');
    if (overlay._setMode) overlay._setMode(mode || 'signin');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    const emailInput = overlay.querySelector('#auth-email');
    setTimeout(() => emailInput && emailInput.focus(), 50);
  }

  /* 마이페이지로 이동 (이미 마이페이지에 있으면 아무 동작 안 함) */
  function goToMyPage() {
    const page = location.pathname.split('/').pop() || 'index.html';
    if (page === 'mypage.html') return;
    location.href = 'mypage.html';
  }

  /* ── 헤더 / 모바일 메뉴의 로그인 버튼 상태 토글 ── */
  function updateAuthUI(user) {
    const authBtn = document.getElementById('auth-btn');
    const authBtnLabel = authBtn ? authBtn.querySelector('.auth-btn-label') : null;
    const mobileAuthLink = document.getElementById('mobile-auth-link');

    if (user) {
      if (authBtnLabel) authBtnLabel.textContent = '마이페이지';
      if (authBtn) authBtn.setAttribute('aria-label', '마이페이지');
      if (mobileAuthLink) mobileAuthLink.textContent = '마이페이지';
    } else {
      if (authBtnLabel) authBtnLabel.textContent = '로그인';
      if (authBtn) authBtn.setAttribute('aria-label', '로그인');
      if (mobileAuthLink) mobileAuthLink.textContent = '로그인';
    }

    // Firebase가 로그인 상태를 최초로 확인해 준 시점 — 깜빡임 없이 텍스트 노출
    if (authBtn) authBtn.classList.remove('auth-btn-pending');
    if (mobileAuthLink) mobileAuthLink.classList.remove('auth-btn-pending');
  }

  function bindAuthButtons() {
    const authBtn = document.getElementById('auth-btn');
    if (authBtn && !authBtn.dataset.bound) {
      authBtn.dataset.bound = '1';
      authBtn.addEventListener('click', function () {
        const user = window.bullionAuth && window.bullionAuth.currentUser;
        if (user) {
          goToMyPage();
        } else {
          openAuthModal('signin');
        }
      });
    }

    const mobileAuthLink = document.getElementById('mobile-auth-link');
    if (mobileAuthLink && !mobileAuthLink.dataset.bound) {
      mobileAuthLink.dataset.bound = '1';
      mobileAuthLink.addEventListener('click', function (e) {
        e.preventDefault();
        const user = window.bullionAuth && window.bullionAuth.currentUser;
        if (user) {
          goToMyPage();
        } else {
          openAuthModal('signin');
        }
      });
    }

    // 현재 로그인 상태를 즉시 반영 (다른 페이지 이동/새로고침 시에도 동기화)
    // authReady가 true일 때만 반영 — 아직 Firebase가 상태를 확인하지 않았다면
    // pending 상태(텍스트 숨김)를 유지해 "로그인 → 마이페이지" 깜빡임을 방지
    if (window.bullionAuth && window.bullionAuth.authReady) {
      updateAuthUI(window.bullionAuth.currentUser);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindAuthButtons);
  } else {
    bindAuthButtons();
  }

  // auth.js가 nav.js보다 늦게 로드되는 경우를 대비해 약간의 지연 후 한번 더 동기화
  setTimeout(bindAuthButtons, 200);

  document.addEventListener('bullion-auth-changed', function (e) {
    updateAuthUI(e.detail && e.detail.user);
  });
})();
