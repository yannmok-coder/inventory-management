import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 홈 화면에 앱으로 설치할 수 있게 하는 서비스워커.
// 개발 서버(vite dev)에는 /sw.js 가 없으므로 프로덕션 빌드에서만 등록합니다.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.error('서비스워커 등록 실패:', err);
    });
  });
}
