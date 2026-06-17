// ============================================================
// auth.js — Firebase Authentication 초기화 및 헬퍼
// MIDAS BULLION (bullion-4d9ef)
//
// GitHub Pages는 정적 호스팅이라 npm 빌드를 쓸 수 없으므로
// Firebase JS SDK를 CDN(ES 모듈)으로 불러와 사용합니다.
// 이 파일은 모든 HTML 페이지에서
//   <script type="module" src="auth.js"></script>
// 형태로 footer.js / nav.js보다 "먼저" 로드되어야 합니다.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase 콘솔 > 프로젝트 설정 > 일반 > 내 앱에서 가져온 설정값
const firebaseConfig = {
  apiKey: "AIzaSyDIVLXckOTpDpp65RWHy6PjUSZzb5QqTTQ",
  authDomain: "bullion-4d9ef.firebaseapp.com",
  projectId: "bullion-4d9ef",
  storageBucket: "bullion-4d9ef.firebasestorage.app",
  messagingSenderId: "288661849731",
  appId: "1:288661849731:web:6cad8fd2424aeec0103db6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ------------------------------------------------------------
// nav.js, footer.js, 각 페이지 스크립트는 type="module"이 아니라
// 일반 <script> 태그라서 ES 모듈을 import할 수 없습니다.
// 그래서 필요한 함수와 현재 로그인 상태를 window 전역 객체에
// 노출시켜 다른 스크립트에서 그냥 가져다 쓸 수 있게 합니다.
// ------------------------------------------------------------
window.bullionAuth = {
  auth,
  currentUser: null, // onAuthStateChanged가 채워줌

  // 이메일/비밀번호 회원가입
  async signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  },

  // 이메일/비밀번호 로그인
  async signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  },

  // 로그아웃
  async signOutUser() {
    return signOut(auth);
  },

  // 로그인 상태가 바뀔 때 실행할 콜백 등록
  // (nav.js에서 헤더 UI를 갱신할 때 사용)
  onChange(callback) {
    return onAuthStateChanged(auth, (user) => {
      window.bullionAuth.currentUser = user;
      callback(user);
    });
  },
};

// 로그인 상태가 바뀔 때마다 커스텀 이벤트를 쏴서
// nav.js 등 다른 스크립트가 이벤트 리스너로도 감지할 수 있게 함
onAuthStateChanged(auth, (user) => {
  window.bullionAuth.currentUser = user;
  document.dispatchEvent(
    new CustomEvent("bullion-auth-changed", { detail: { user } })
  );
});
