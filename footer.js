(function () {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-col">
        <h4>카탈로그</h4>
        <ul>
          <li><a href="#">› 금화</a></li><li><a href="#">› 금화1</a></li>
          <li><a href="#">› 금화2</a></li><li><a href="#">› 금화3</a></li>
          <li><a href="#">› 금화4</a></li>
        </ul>
        <h4 style="margin-top:1.5rem">기타 서비스</h4>
        <ul>
          <li><a href="#">› 예정1</a></li><li><a href="#">› 예정2</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>문의 사항</h4>
        <ul>
          <li><a href="#">› 내 계정</a></li><li><a href="#">› 주문 내역</a></li><li><a href="#">› 고객센터</a></li>
        </ul>
        <h4 style="margin-top:1.5rem">관련 정보</h4>
        <ul>
          <li><a href="#">› 회사 소개</a></li><li><a href="#">› 온라인 예약</a></li>
          <li><a href="#">› 거래 안내</a></li><li><a href="#">› 오시는 길</a></li>
          <li><a href="#">› 귀금속 투명성</a></li><li><a href="#">› 정품 인증</a></li>
          <li><a href="#">› 서비스 약관</a></li><li><a href="#">› 자주 묻는 질문</a></li>
        </ul>
      </div>
      <div class="footer-locations">
        <h4>오시는 길</h4>
        <div class="location-grid">
          <div class="location-item">
            <strong>서울 본점</strong>
            <p>서울특별시 종로구 종로 1가 1번지<br>타임스퀘어 CBD<br>02-1234-5678</p>
            <p>월 - 금 09:00 - 18:00<br>점심시간 12:00 - 13:00</p>
          </div>
          <div class="location-item">
            <strong>강남 지점</strong>
            <p>서울특별시 강남구 테헤란로 123<br>강남파이낸스센터 10층<br>02-9876-5432</p>
            <p>월 - 금 13:00 - 17:00</p>
          </div>
        </div>
        <p class="location-notice">원활한 서비스를 위해 방문 전 예약을 권장합니다</p>
        <div class="social-section">
          <h4>소셜 미디어</h4>
          <div class="social-icons">
            <a href="#" class="social-icon facebook">f</a>
            <a href="#" class="social-icon instagram">📷</a>
            <a href="#" class="social-icon youtube">▶</a>
            <a href="#" class="social-icon line">LINE</a>
            <a href="https://open.kakao.com/o/sB6Gduni" target="_blank" rel="noopener" class="social-icon kakao" style="display:flex;align-items:center;justify-content:center;"><svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 2C8.27 2 2 7.37 2 14c0 4.2 2.65 7.9 6.67 10.1L7.1 28.8a.6.6 0 0 0 .84.76l6.4-4.27c.54.05 1.09.08 1.66.08 7.73 0 14-5.37 14-12S23.73 2 16 2z" fill="#3C1E1E"/><text x="16" y="15.8" text-anchor="middle" font-family="Arial, sans-serif" font-size="7" font-weight="900" fill="#FEE500" letter-spacing="0.3">KAKAO</text></svg></a>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 MIDAS BULLION 귀금속 전문점. 사업자등록번호: 123-45-67890</p>
      <p>귀금속은 투자 위험이 있습니다. 투자 전 충분한 검토를 권장합니다.</p>
    </div>
  `;
})();

// ===== 카카오 플로팅 버튼 (모든 페이지 공통) =====
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .kakao-float {
      position: fixed; right: 20px; bottom: 80px;
      width: 54px; height: 54px;
      background: #FEE500; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      z-index: 2000;
      box-shadow: 0 0 0 3px #C8A84B, 0 4px 16px rgba(0,0,0,0.25);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .kakao-float:hover {
      transform: scale(1.1);
      box-shadow: 0 0 0 3px #F5E090, 0 6px 20px rgba(0,0,0,0.3);
    }
  `;
  document.head.appendChild(style);

  const KAKAO_LINK = 'https://open.kakao.com/o/sB6Gduni';

  const link = document.createElement('a');
  link.href = KAKAO_LINK;
  link.target = '_blank';
  link.rel = 'noopener';
  link.className = 'kakao-float';
  link.innerHTML = `
    <svg width="46" height="46" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2C8.27 2 2 7.37 2 14c0 4.2 2.65 7.9 6.67 10.1L7.1 28.8a.6.6 0 0 0 .84.76l6.4-4.27c.54.05 1.09.08 1.66.08 7.73 0 14-5.37 14-12S23.73 2 16 2z" fill="#3C1E1E"/>
      <text x="16" y="15.8" text-anchor="middle" font-family="'Arial', sans-serif" font-size="7" font-weight="900" fill="#FEE500" letter-spacing="0.3">KAKAO</text>
    </svg>
  `;
  document.body.appendChild(link);
})();
