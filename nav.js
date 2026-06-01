(function () {

  /* ── 스타일 주입 (구 nav.css) ── */
  const style = document.createElement('style');
  style.textContent = `
    .logo-wrap { display:flex; align-items:center; gap:14px; text-decoration:none; }
    .logo-symbol { flex-shrink:0; width:54px; height:54px; }
    .logo-text-block { display:flex; flex-direction:column; gap:2px; }
    .logo-brand { font-family:'Cinzel',serif; font-size:22px; font-weight:700; letter-spacing:4px; line-height:1; background:linear-gradient(135deg,#C8A84B 0%,#F5E090 40%,#C8A84B 60%,#9A7B2E 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .logo-sub-kr { font-family:'Noto Serif KR',serif; font-size:10px; letter-spacing:3px; color:#B8960C; font-weight:400; }
  `;
  document.head.appendChild(style);

  // 현재 페이지 파일명으로 active 링크 결정
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
          <div class="search-category">
            <select><option>전체</option><option>금화</option><option>은화</option><option>금바</option></select>
          </div>
          <input type="text" placeholder="상품 검색..." class="search-input">
          <button class="search-btn">검색</button>
        </div>
        <div class="header-icons">
          <button class="icon-btn" aria-label="장바구니">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="22" height="22"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span class="cart-count">0</span>
          </button>
          <button class="hamburger" id="hamburger"><span></span><span></span><span></span></button>
        </div>
      </div>`;

    // 스크롤 그림자
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 16px rgba(0,0,0,0.12)'
        : '0 2px 8px rgba(0,0,0,0.06)';
    }, { passive: true });
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
      <ul>
        <li><a href="coins.html">금화 보기</a></li>
        <li><a href="gold-price.html">금 시세</a></li>
        <li><a href="contact.html">구매 문의</a></li>
      </ul>`;
  }

  /* ── 햄버거 이벤트 ── */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('#hamburger');
    if (!btn) return;
    const menu = document.getElementById('nav-mobile');
    if (menu) {
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    }
  });

  /* ── 시세 업데이트 ── */
  const SHEET_ID = '1gMqKhtWwTAizoBGlrGDpm6sl5c6vmbotGzg3qXl16-w';
  async function updatePrices() {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=계산`;
      const res = await fetch(url);
      const text = await res.text();
      const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/)[1]);
      const row = json.table.rows[0].c;
      const goldPrice    = row[0]?.v;
      const silverPrice  = row[1]?.v;
      const platPrice    = row[2]?.v;
      const exchangeRate = row[4]?.v;
      if (goldPrice)    document.getElementById('tb-gold').textContent    = `$${Number(goldPrice).toFixed(2)}`;
      if (silverPrice)  document.getElementById('tb-silver').textContent  = `$${Number(silverPrice).toFixed(2)}`;
      if (platPrice)    document.getElementById('tb-platinum').textContent = `$${Number(platPrice).toFixed(2)}`;
      if (exchangeRate) document.getElementById('tb-rate').textContent    = `${Number(exchangeRate).toLocaleString()}원`;
    } catch(e) { console.error(e); }
  }
  updatePrices();
  setInterval(updatePrices, 30000);
})();
