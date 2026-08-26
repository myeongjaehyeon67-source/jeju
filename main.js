// 모바일 내비게이션 토글
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => {
  nav.classList.toggle('is-open');
});
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('is-open'));
});

// 스크롤에 따른 맨 위로 버튼 표시
const toTopBtn = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTopBtn.classList.toggle('is-visible', window.scrollY > 600);
});
toTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 스크롤 등장 애니메이션
const revealTargets = document.querySelectorAll(
  '.about__card, .menu__card, .vision__card, .visit__card, .info-block'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => observer.observe(el));

// 메뉴 탭 필터
const menuTabs = document.querySelectorAll('.menu__tab');
const menuCards = document.querySelectorAll('.menu__card');
menuTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    menuTabs.forEach(t => t.classList.remove('is-active'));
    tab.classList.add('is-active');
    const cat = tab.dataset.cat;
    menuCards.forEach(card => {
      card.style.display = card.dataset.cat === cat ? '' : 'none';
    });
  });
});

// 주소 복사
const copyBtn = document.getElementById('copyAddress');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const text = '제주특별자치도 제주시 관덕로11길 34 (제주더큰내일센터 1층)';
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = '복사 완료!';
    } catch (e) {
      copyBtn.textContent = '복사 실패, 직접 선택해주세요';
    }
    setTimeout(() => { copyBtn.textContent = '주소 복사하기'; }, 2000);
  });
}

// Leaflet 지도: 제주국제공항 → 귤등대(제주더큰내일센터)
const AIRPORT = [33.5113, 126.4930];
const YONGMUN_ROTARY = [33.5091, 126.5105];
const TAPDONG = [33.5181, 126.5266];
const CAFE = [33.5168, 126.5258];

const map = L.map('map', {
  scrollWheelZoom: false,
}).setView([33.5140, 126.5090], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
}).addTo(map);

const airportIcon = L.divIcon({
  className: 'custom-pin',
  html: '<div style="background:#0d3b53;color:#fff;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 6px 14px rgba(0,0,0,0.3);border:2px solid #fff;">✈️</div>',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const cafeIcon = L.divIcon({
  className: 'custom-pin',
  html: '<div style="background:#ff8c3c;color:#fff;width:38px;height:38px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 6px 14px rgba(0,0,0,0.35);border:2px solid #fff;"><span style="transform:rotate(45deg);">🏮</span></div>',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

L.marker(AIRPORT, { icon: airportIcon })
  .addTo(map)
  .bindPopup('<b>제주국제공항</b><br>여기서 출발!');

L.marker(CAFE, { icon: cafeIcon })
  .addTo(map)
  .bindPopup('<b>귤등대 GYULDEUNGDAE</b><br>제주더큰내일센터 1층<br>관덕로11길 34')
  .openPopup();

// 공항 → 용문로터리 → 탑동사거리 → 카페 (안내 경로 개략선)
const routeLine = L.polyline([AIRPORT, YONGMUN_ROTARY, TAPDONG, CAFE], {
  color: '#ff8c3c',
  weight: 4,
  opacity: 0.85,
  dashArray: '8 8',
}).addTo(map);

map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });

map.on('focus', () => map.scrollWheelZoom.enable());
map.on('blur', () => map.scrollWheelZoom.disable());
