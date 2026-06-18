/* ===========================
   MOOV — main.js
=========================== */

// ── Fallback 데이터 (Supabase 실패 시 표시) ──────────────────
const FALLBACK_CONTENTS = [
  { id:1, title:'블레이드 런너 2049', genre:'SF · 액션', info:'2017 · 163분',
    image_url:'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
    badge:'NEW', rating:8.0, description:'2049년, 세계의 균형을 무너뜨릴 비밀을 파헤치는 블레이드 러너 K의 추적극' },
  { id:2, title:'듄: 파트 2', genre:'SF · 어드벤처', info:'2024 · 166분',
    image_url:'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop',
    badge:'HOT', rating:8.5, description:'예언자가 된 폴 아트레이데스와 프레멘 전사들의 운명적인 아라키스 해방 전쟁' },
  { id:3, title:'오펜하이머', genre:'드라마 · 전쟁', info:'2023 · 180분',
    image_url:'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop',
    badge:null, rating:8.5, description:'세상을 영원히 바꾼 원자폭탄 개발자 로버트 오펜하이머의 영광과 비극' },
  { id:4, title:'매트릭스', genre:'SF · 액션', info:'1999 · 136분',
    image_url:'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400&h=600&fit=crop',
    badge:null, rating:8.7, description:'현실이라 믿어온 세계가 기계가 만든 거대한 시뮬레이션이었다는 충격적 진실' },
  { id:5, title:'인터스텔라', genre:'SF · 드라마', info:'2014 · 169분',
    image_url:'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop',
    badge:'TOP', rating:8.6, description:'인류의 마지막 희망을 찾아 블랙홀 너머 미지의 우주로 떠난 우주 비행사의 여정' },
  { id:6, title:'기생충', genre:'드라마 · 블랙코미디', info:'2019 · 132분',
    image_url:'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop',
    badge:null, rating:8.5, description:'반지하 가족과 고급 저택 부유층 사이에서 벌어지는 계급의 비밀과 충돌' },
  { id:7, title:'더 배트맨', genre:'액션 · 누아르', info:'2022 · 176분',
    image_url:'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop',
    badge:'4K', rating:7.9, description:'고담의 어둠 속에서 연쇄 살인마를 추적하는 배트맨의 가장 어두운 이야기' },
  { id:8, title:'1917', genre:'전쟁 · 드라마', info:'2019 · 119분',
    image_url:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    badge:null, rating:8.3, description:'아군을 구하기 위해 적진을 가로질러야 하는 두 병사의 숨막히는 실시간 여정' },
];

const FALLBACK_RECS = [
  { id:1, title:'테넷', genre:'SF · 스릴러',
    image_url:'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&h=600&fit=crop',
    description:'시간을 역행하는 비밀 요원의 세계 구원 임무' },
  { id:2, title:'킹덤: 아신전', genre:'사극 · 스릴러',
    image_url:'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
    description:'조선 시대 좀비 재앙의 기원을 담은 충격적 프리퀄' },
  { id:3, title:'올드보이', genre:'스릴러 · 미스터리',
    image_url:'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop',
    description:'15년간 이유도 모른 채 감금됐다 풀려난 한 남자의 처절한 복수' },
  { id:4, title:'승리호', genre:'SF · 액션',
    image_url:'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop',
    description:'2092년 우주 청소선 선원들이 발견한 인류 최후의 비밀 병기' },
];

// ── Supabase 초기화 ──────────────────────────────────────────
const SUPABASE_URL = 'https://zhsgrijtbgfrflwwgwwp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpoc2dyaWp0YmdmcmZsd3dnd3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTczODEsImV4cCI6MjA5NjQzMzM4MX0.FiE8krEBr4pqOdUx7k3_Sh4sqfOO7fB0H8sfr2Yfbbo';
const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Toast 메시지 ─────────────────────────────────────────────
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

// ── 스크롤 헤더 효과 + 탑버튼 ───────────────────────────────
const header = document.getElementById('header');
const topBtn = document.getElementById('topBtn');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
  topBtn?.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

// ── 섹션 스크롤 이동 ─────────────────────────────────────────
function scrollToSection(e, id) {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// ── Intersection Observer (섹션 헤더 / 상세 영역용) ──────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ── 카드 렌더 헬퍼 ───────────────────────────────────────────
function getBadgeClass(badge) {
  if (!badge) return '';
  const map = { TOP: 'card__badge--top', HOT: 'card__badge--hot', '4K': 'card__badge--4k' };
  return map[badge] || '';
}

function renderContentCards(contents) {
  const grid = document.getElementById('contentGrid');
  grid.innerHTML = contents.map((item, i) => {
    const title  = item.title.replace(/'/g, "\\'");
    const imgUrl = item.image_url.replace(/'/g, "\\'");
    return `
    <div class="card card--loaded" style="animation-delay:${i * 0.07}s">
      <div class="card__img-wrap">
        <img src="${item.image_url}" alt="${item.title}" loading="lazy" />
        ${item.badge ? `<span class="card__badge ${getBadgeClass(item.badge)}">${item.badge}</span>` : ''}
        <div class="card__overlay" onclick="openPlayer('${title}', '${imgUrl}')">
          <div class="card__overlay-inner">
            ${item.description ? `<p class="card__desc">${item.description}</p>` : ''}
            <div class="card__play">▶ 재생</div>
          </div>
        </div>
      </div>
      <div class="card__body">
        <p class="card__title">${item.title}</p>
        <div class="card__meta">
          <span class="card__genre">${item.genre ?? ''}</span>
          <span class="card__rating">⭐ ${item.rating ?? ''}</span>
        </div>
        <p class="card__info">${item.info ?? ''}</p>
      </div>
    </div>`;
  }).join('');
}

function renderRecommendCards(recs) {
  const grid = document.getElementById('recommendGrid');
  grid.innerHTML = recs.map((item, i) => {
    const title  = item.title.replace(/'/g, "\\'");
    const imgUrl = item.image_url.replace(/'/g, "\\'");
    return `
    <div class="rec-card card--loaded" style="animation-delay:${i * 0.1}s">
      <div class="rec-card__img">
        <img src="${item.image_url}" alt="${item.title}" loading="lazy" />
        <div class="rec-card__overlay" onclick="openPlayer('${title}', '${imgUrl}')">
          <div class="card__play">▶</div>
        </div>
      </div>
      <div class="rec-card__body">
        <p class="rec-card__title">${item.title}</p>
        <p class="rec-card__genre">${item.genre ?? ''}</p>
        ${item.description ? `<p class="rec-card__desc">${item.description}</p>` : ''}
      </div>
    </div>`;
  }).join('');
}

// ── 데이터 로드 (Supabase → fallback 순) ─────────────────────
async function loadData() {
  // fallback 먼저 즉시 렌더 (네트워크 없어도 카드 표시)
  renderContentCards(FALLBACK_CONTENTS);
  renderRecommendCards(FALLBACK_RECS);

  // Supabase에서 최신 데이터로 교체 시도
  if (!supabaseClient) return;
  try {
    const [{ data: contents, error: e1 }, { data: recs, error: e2 }] = await Promise.all([
      supabaseClient.from('moov_contents').select('*').order('sort_order'),
      supabaseClient.from('moov_recommendations').select('*').order('sort_order'),
    ]);
    if (!e1 && contents?.length) renderContentCards(contents);
    if (!e2 && recs?.length) renderRecommendCards(recs);
  } catch {
    // fallback 데이터로 이미 렌더됨
  }
}

document.addEventListener('DOMContentLoaded', loadData);

// ── 영상 플레이어 모달 ────────────────────────────────────────
let playerState = { playing: false, progress: 0, muted: false, timer: null, elapsed: 0 };
const TOTAL_SEC = 157; // 2:37

function openPlayer(title, imgUrl) {
  if (title)  document.querySelector('.player-screen__title').textContent = title;
  if (imgUrl) document.querySelector('.player-screen__bg').src = imgUrl;
  document.getElementById('playerBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
  // 이전 재생 상태 초기화
  playerState.elapsed = 0;
  document.getElementById('progressBar').style.width = '0%';
  document.getElementById('currentTime').textContent = '0:00';
  setTimeout(() => startPlay(), 400);
}

function closePlayer(e) {
  if (e && e.target !== document.getElementById('playerBackdrop')) return;
  stopPlay();
  document.getElementById('playerBackdrop').classList.remove('open');
  document.getElementById('progressBar').style.width = '0%';
  document.getElementById('currentTime').textContent = '0:00';
  playerState.elapsed = 0;
  document.body.style.overflow = '';
}

function togglePlay() {
  playerState.playing ? stopPlay() : startPlay();
}

function startPlay() {
  playerState.playing = true;
  document.getElementById('playBtn').textContent        = '⏸';
  document.getElementById('playerCenterIcon').textContent = '⏸';
  document.getElementById('playerCenterBtn').classList.remove('paused');
  document.getElementById('playerDim').classList.remove('paused');
  clearInterval(playerState.timer);
  playerState.timer = setInterval(() => {
    playerState.elapsed = Math.min(playerState.elapsed + 1, TOTAL_SEC);
    const pct = (playerState.elapsed / TOTAL_SEC) * 100;
    document.getElementById('progressBar').style.width = pct + '%';
    document.getElementById('currentTime').textContent = fmtTime(playerState.elapsed);
    if (playerState.elapsed >= TOTAL_SEC) stopPlay();
  }, 1000);
}

function stopPlay() {
  playerState.playing = false;
  clearInterval(playerState.timer);
  document.getElementById('playBtn').textContent        = '▶';
  document.getElementById('playerCenterIcon').textContent = '▶';
  document.getElementById('playerCenterBtn').classList.add('paused');
  document.getElementById('playerDim').classList.add('paused');
}

function seekPlayer(e) {
  const bar = e.currentTarget;
  const pct = e.offsetX / bar.offsetWidth;
  playerState.elapsed = Math.floor(pct * TOTAL_SEC);
  document.getElementById('progressBar').style.width = (pct * 100) + '%';
  document.getElementById('currentTime').textContent = fmtTime(playerState.elapsed);
}

function toggleMute() {
  playerState.muted = !playerState.muted;
  document.getElementById('muteBtn').textContent = playerState.muted ? '🔇' : '🔊';
  document.getElementById('volumeSlider').value  = playerState.muted ? 0 : 80;
}

function setVolume(v) {
  playerState.muted = v == 0;
  document.getElementById('muteBtn').textContent = v == 0 ? '🔇' : '🔊';
}

function fmtTime(s) {
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePlayer(null);
  if (e.key === ' ' && document.getElementById('playerBackdrop').classList.contains('open')) {
    e.preventDefault(); togglePlay();
  }
});

// ── 커스텀 네온 커서 ─────────────────────────────────────────
(function initCursor() {
  const dot  = document.createElement('div'); dot.id  = 'moov-cursor';
  const ring = document.createElement('div'); ring.id = 'moov-cursor-ring';
  document.body.append(dot, ring);

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  }, { passive: true });

  // 링은 약간 지연되어 따라옴
  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  // 클릭 가능한 모든 요소에 hover 시 커서 확대
  const HOVER_SEL = 'a, button, .card, .rec-card, .cast-card, .nav__link, .logo, .footer__link, [onclick]';

  function addHover() {
    document.querySelectorAll(HOVER_SEL).forEach(el => {
      if (el.dataset.cursorBound) return;
      el.dataset.cursorBound = '1';
      el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
    });
  }
  addHover();
  // 동적 카드 렌더 후에도 재등록
  new MutationObserver(addHover).observe(document.body, { childList: true, subtree: true });

  // 클릭 시 커서 펄스
  document.addEventListener('mousedown', () => {
    dot.style.transform  = 'translate(-50%,-50%) scale(0.6)';
    ring.style.transform = 'translate(-50%,-50%) scale(0.8)';
  });
  document.addEventListener('mouseup', () => {
    dot.style.transform  = '';
    ring.style.transform = '';
  });
})();

// ── 3D 카드 틸트 ────────────────────────────────────────────
(function initTilt() {
  const TILT_SEL = '.card, .rec-card';
  const MAX_ROT  = 12;

  function bindTilt(el) {
    if (el.dataset.tiltBound) return;
    el.dataset.tiltBound = '1';

    el.addEventListener('mousemove', (e) => {
      const r  = el.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width  - 0.5;   // -0.5 ~ 0.5
      const y  = (e.clientY - r.top)  / r.height - 0.5;
      const rY =  x * MAX_ROT;
      const rX = -y * MAX_ROT;
      el.style.transition = 'transform 0.1s ease, box-shadow 0.35s ease, border-color 0.35s ease';
      el.style.transform  = `perspective(800px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.04)`;
    });

    el.addEventListener('mouseleave', () => {
      el.classList.add('tilt-reset');
      el.style.transform = '';
      setTimeout(() => el.classList.remove('tilt-reset'), 500);
    });
  }

  function bindAll() {
    document.querySelectorAll(TILT_SEL).forEach(bindTilt);
  }
  bindAll();
  new MutationObserver(bindAll).observe(document.getElementById('contentGrid')  || document.body, { childList: true });
  new MutationObserver(bindAll).observe(document.getElementById('recommendGrid') || document.body, { childList: true });
})();
