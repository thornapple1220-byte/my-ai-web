/* ===========================
   MOOV — main.js
=========================== */

// ── Supabase 초기화 ──────────────────────────────────────────
const SUPABASE_URL = 'https://zhsgrijtbgfrflwwgwwp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpoc2dyaWp0YmdmcmZsd3dnd3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTczODEsImV4cCI6MjA5NjQzMzM4MX0.FiE8krEBr4pqOdUx7k3_Sh4sqfOO7fB0H8sfr2Yfbbo';

if (!window.supabase) {
  console.error('Supabase CDN 로드 실패 — window.supabase undefined');
}
const supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);

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

// ── Intersection Observer (Reveal) ───────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ── 콘텐츠 카드 렌더링 ──────────────────────────────────────
function getBadgeClass(badge) {
  if (!badge) return '';
  const map = { TOP: 'card__badge--top', HOT: 'card__badge--hot', '4K': 'card__badge--4k' };
  return map[badge] || '';
}

function renderContentCards(contents) {
  const grid = document.getElementById('contentGrid');
  grid.innerHTML = contents.map((item) => `
    <div class="card reveal" onclick="showToast('${item.title} 재생을 시작합니다!')">
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

  // 새로 추가된 카드에 reveal 옵저버 등록
  grid.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
}

// ── 추천 카드 렌더링 ─────────────────────────────────────────
function renderRecommendCards(recs) {
  const grid = document.getElementById('recommendGrid');
  grid.innerHTML = recs.map((item) => `
    <div class="rec-card reveal" onclick="showToast('${item.title} 상세정보를 불러옵니다')">
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

  grid.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
}

// ── Supabase 데이터 로드 ─────────────────────────────────────
async function loadData() {
  if (!supabase) {
    document.getElementById('contentGrid').innerHTML = '<p style="color:var(--gray);grid-column:1/-1;text-align:center;padding:40px">콘텐츠를 불러올 수 없습니다 (Supabase 연결 실패)</p>';
    document.getElementById('recommendGrid').innerHTML = '';
    return;
  }
  try {
    const [{ data: contents, error: e1 }, { data: recs, error: e2 }] = await Promise.all([
      supabase.from('moov_contents').select('*').order('sort_order'),
      supabase.from('moov_recommendations').select('*').order('sort_order'),
    ]);

    if (e1 || e2) throw new Error(e1?.message ?? e2?.message);
    if (contents?.length) renderContentCards(contents);
    if (recs?.length) renderRecommendCards(recs);
  } catch (err) {
    console.error('MOOV 데이터 로드 실패:', err);
    document.getElementById('contentGrid').innerHTML = `<p style="color:var(--gray);grid-column:1/-1;text-align:center;padding:40px">오류: ${err.message}</p>`;
  }
}

// ── 초기화 ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadData);
