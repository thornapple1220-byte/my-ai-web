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

// ── 스크롤 헤더 효과 ─────────────────────────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
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
  grid.innerHTML = contents.map((item, i) => `
    <div class="card card--loaded" style="animation-delay:${i * 0.07}s"
         onclick="showToast('${item.title} 재생을 시작합니다!')">
      <div class="card__img-wrap">
        <img src="${item.image_url}" alt="${item.title}" loading="lazy" />
        ${item.badge ? `<span class="card__badge ${getBadgeClass(item.badge)}">${item.badge}</span>` : ''}
        <div class="card__overlay">
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
    </div>
  `).join('');
}

function renderRecommendCards(recs) {
  const grid = document.getElementById('recommendGrid');
  grid.innerHTML = recs.map((item, i) => `
    <div class="rec-card card--loaded" style="animation-delay:${i * 0.1}s"
         onclick="showToast('${item.title} 상세정보를 불러옵니다')">
      <div class="rec-card__img">
        <img src="${item.image_url}" alt="${item.title}" loading="lazy" />
        <div class="rec-card__overlay">
          <div class="card__play">▶</div>
        </div>
      </div>
      <div class="rec-card__body">
        <p class="rec-card__title">${item.title}</p>
        <p class="rec-card__genre">${item.genre ?? ''}</p>
        ${item.description ? `<p class="rec-card__desc">${item.description}</p>` : ''}
      </div>
    </div>
  `).join('');
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
