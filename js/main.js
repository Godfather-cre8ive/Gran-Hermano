/* ============================================================
   Gran Hermano Academy — Main JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- RENDER ALL SECTIONS ---- */
  renderSite();

  /* ---- NAVBAR ---- */
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.nav-hamburger');
  const navBody = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
    // back to top
    const bt = document.querySelector('.back-top');
    if (bt) bt.classList.toggle('visible', window.scrollY > 400);
  });

  hamburger?.addEventListener('click', () => {
    navBody?.classList.toggle('nav-open');
  });

  // Mobile dropdown toggle
  document.querySelectorAll('.nav-item .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && link.nextElementSibling?.classList.contains('dropdown')) {
        e.preventDefault();
        link.closest('.nav-item').classList.toggle('sub-open');
      }
    });
  });

  /* ---- HERO SLIDER ---- */
  initHeroSlider();

  /* ---- COUNTDOWN ---- */
  initCountdown();

  /* ---- BACK TO TOP ---- */
  document.querySelector('.back-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- SCROLL ANIMATIONS ---- */
  initScrollAnimations();

  /* ---- ADMIN BAR ---- */
  checkAdminSession();
});

/* ============================================================
   RENDER SITE FROM DATA
   ============================================================ */
function renderSite() {
  renderHeroSlides();
  renderAdmissionBanner();
  renderJambScorers();
  renderSchoolSections();
  renderAbout();
  renderWhyChoose();
  renderFacilities();
  renderAnthem();
  renderVision();
  renderNews();
  renderFooter();
  renderNavbar();
}

function renderNavbar() {
  const d = GHA_DATA;
  const logoWrap = document.querySelector('.navbar-logo');
  if (logoWrap) {
    logoWrap.querySelector('img').src = d.site.logo;
  }
  const topBarPhone = document.querySelector('.topbar-phone');
  const topBarEmail = document.querySelector('.topbar-email');
  const topBarBadge = document.querySelector('.admission-badge');
  if (topBarPhone) topBarPhone.textContent = d.site.phone1;
  if (topBarEmail) topBarEmail.textContent = d.site.email;
  if (topBarBadge) topBarBadge.textContent = d.site.admissionBanner;
}

function renderHeroSlides() {
  const track = document.querySelector('.hero-track');
  const dotsEl = document.querySelector('.hero-nav');
  if (!track) return;
  const slides = GHA_DATA.hero.slides;
  track.innerHTML = slides.map((s, i) => `
    <div class="hero-slide${i===0?' active':''}" data-idx="${i}">
      <img src="${s.image}" alt="${s.headline}" loading="${i===0?'eager':'lazy'}">
      <div class="hero-overlay"></div>
    </div>
  `).join('');
  if (dotsEl) {
    dotsEl.innerHTML = slides.map((_, i) =>
      `<button class="hero-dot${i===0?' active':''}" data-dot="${i}" aria-label="Slide ${i+1}"></button>`
    ).join('');
  }
  // hero text is static template in HTML, just update first slide text
  updateHeroContent(0);
}

function updateHeroContent(idx) {
  const s = GHA_DATA.hero.slides[idx];
  const h1 = document.querySelector('.hero-content h1');
  const sub = document.querySelector('.hero-content .sub');
  if (h1) h1.innerHTML = s.headline;
  if (sub) sub.textContent = s.sub;
}

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let current = 0, timer;

  function goTo(idx) {
    slides[current]?.classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current]?.classList.add('active');
    dots[current]?.classList.add('active');
    updateHeroContent(current);
  }

  function autoPlay() {
    timer = setInterval(() => goTo(current + 1), 5500);
  }

  autoPlay();

  document.querySelectorAll('.hero-dot').forEach((d, i) => {
    d.addEventListener('click', () => { clearInterval(timer); goTo(i); autoPlay(); });
  });
  document.querySelector('.hero-prev')?.addEventListener('click', () => { clearInterval(timer); goTo(current - 1); autoPlay(); });
  document.querySelector('.hero-next')?.addEventListener('click', () => { clearInterval(timer); goTo(current + 1); autoPlay(); });
}

function renderAdmissionBanner() {
  const a = GHA_DATA.admission;
  const h = document.querySelector('.admission-headline');
  const s = document.querySelector('.admission-sub');
  const ex = document.querySelector('.exam-dates-text');
  const cta = document.querySelector('.admission-cta');
  if (h) h.textContent = a.headline;
  if (s) s.textContent = a.sub;
  if (ex) ex.textContent = a.examDates;
  if (cta) { cta.textContent = a.ctaText; cta.href = a.ctaLink; }
}

function initCountdown() {
  const target = new Date(GHA_DATA.admission.countdownTarget).getTime();
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      ['days','hours','mins','secs'].forEach(u => {
        const el = document.getElementById('cd-' + u);
        if (el) el.textContent = '00';
      });
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');
    const days = document.getElementById('cd-days'); if (days) days.textContent = pad(d);
    const hrs = document.getElementById('cd-hours'); if (hrs) hrs.textContent = pad(h);
    const mins = document.getElementById('cd-mins'); if (mins) mins.textContent = pad(m);
    const secs = document.getElementById('cd-secs'); if (secs) secs.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);
}

function renderJambScorers() {
  const grid = document.querySelector('.jamb-grid');
  const titleEl = document.querySelector('.jamb-title');
  if (!grid) return;
  const { year, title, scorers } = GHA_DATA.jamb;
  if (titleEl) titleEl.textContent = `${year} ${title}`;
  const medals = ['🥇','🥈','🥉'];
  grid.innerHTML = scorers.map((s, i) => `
    <div class="scorer-card">
      <div class="scorer-rank">${medals[i] || `#${i+1}`}</div>
      <img class="scorer-img" src="${s.image}" alt="${s.name}" onerror="this.src='https://via.placeholder.com/72?text=GHA'">
      <div class="scorer-info">
        <h4>${s.name}</h4>
        <div class="year">${s.year}</div>
        <div class="scorer-scores">
          ${s.scores.map(sc => `<span class="score-pill">${sc.subj}: ${sc.val}</span>`).join('')}
        </div>
        <div class="scorer-total">${s.total} <span>/ 400</span></div>
      </div>
    </div>
  `).join('');
}

function renderSchoolSections() {
  const grid = document.querySelector('.levels-grid');
  if (!grid) return;
  const secs = GHA_DATA.sections;
  grid.innerHTML = Object.values(secs).map(s => `
    <div class="level-card">
      <img src="${s.image}" alt="${s.title}" loading="lazy">
      <div class="level-overlay"></div>
      <div class="level-content">
        <h3>${s.title}</h3>
        <p>${s.description}</p>
        <a href="#contact" class="btn btn--gold">${s.cta}</a>
      </div>
    </div>
  `).join('');
}

function renderAbout() {
  const a = GHA_DATA.about;
  const img = document.querySelector('.about-image-wrap img');
  const title = document.querySelector('.about-title');
  const body = document.querySelector('.about-body');
  const statsEl = document.querySelector('.about-stats');
  if (img) img.src = a.image;
  if (title) title.textContent = a.title;
  if (body) body.textContent = a.body;
  if (statsEl) {
    statsEl.innerHTML = a.stats.map(s => `
      <div class="stat-box">
        <div class="num">${s.value}</div>
        <div class="lbl">${s.label}</div>
      </div>
    `).join('');
  }
}

function renderWhyChoose() {
  const grid = document.querySelector('.why-grid');
  const title = document.querySelector('.why-title');
  const sub = document.querySelector('.why-sub');
  if (!grid) return;
  const w = GHA_DATA.whyChoose;
  if (title) title.textContent = w.title;
  if (sub) sub.textContent = w.subtitle;
  grid.innerHTML = w.items.map(item => `
    <div class="why-card">
      <img class="why-card-img" src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="why-card-body">
        <h4>${item.title}</h4>
        <p>${item.description}</p>
      </div>
    </div>
  `).join('');
}

function renderFacilities() {
  const grid = document.querySelector('.facilities-grid');
  if (!grid) return;
  grid.innerHTML = GHA_DATA.facilities.map(f => `
    <div class="facility-card">
      <img class="facility-img" src="${f.image}" alt="${f.title}" loading="lazy">
      <div class="facility-body">
        <h4>${f.title}</h4>
        <p>${f.description}</p>
      </div>
    </div>
  `).join('');
}

function renderAnthem() {
  const v1 = document.querySelector('.anthem-v1');
  const v2 = document.querySelector('.anthem-v2');
  if (v1) v1.textContent = GHA_DATA.anthem.verse1;
  if (v2) v2.textContent = GHA_DATA.anthem.verse2;
}

function renderVision() {
  const v = GHA_DATA.vision;
  const visText = document.querySelector('.vision-text');
  const misText = document.querySelector('.mission-text');
  const valGrid = document.querySelector('.values-list');
  const visImg = document.querySelector('.vision-image');
  const icons = ['⭐','🤝','🏆','🛡️'];
  if (visText) visText.textContent = v.text;
  if (misText) misText.textContent = v.mission;
  if (visImg) visImg.src = v.image;
  if (valGrid) {
    valGrid.innerHTML = v.coreValues.map((val, i) => `
      <div class="value-item">
        <div class="value-icon">${icons[i]}</div>
        <div>
          <h4>${val.name}</h4>
          <p>${val.desc}</p>
        </div>
      </div>
    `).join('');
  }
}

function renderNews() {
  const grid = document.querySelector('.news-grid');
  if (!grid) return;
  grid.innerHTML = GHA_DATA.news.map(n => `
    <div class="news-card" onclick="openNewsModal(${n.id})">
      <img class="news-img" src="${n.image}" alt="${n.title}" loading="lazy">
      <div class="news-body">
        <div class="news-meta">
          <span class="news-cat">${n.category}</span>
          <span>${n.date}</span>
          <span>· ${n.author}</span>
        </div>
        <h4>${n.title}</h4>
        <p>${n.excerpt}</p>
      </div>
    </div>
  `).join('');
}

function openNewsModal(id) {
  const n = GHA_DATA.news.find(x => x.id === id);
  if (!n) return;
  const overlay = document.querySelector('.modal-overlay');
  const modal = overlay?.querySelector('.modal');
  if (!modal) return;
  modal.innerHTML = `
    <button class="modal-close" onclick="closeModal()">✕</button>
    <img src="${n.image}" alt="${n.title}">
    <div class="modal-body">
      <div class="news-meta" style="margin-bottom:0.75rem">
        <span class="news-cat">${n.category}</span>
        <span>${n.date}</span>
        <span>· ${n.author}</span>
      </div>
      <h3 style="margin-bottom:1rem">${n.title}</h3>
      <p style="line-height:1.8">${n.content}</p>
    </div>
  `;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.querySelector('.modal-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelector('.modal-overlay')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

function renderFooter() {
  const d = GHA_DATA;
  const fLogo = document.querySelector('.footer-brand img');
  const fDesc = document.querySelector('.footer-desc');
  const fPhone = document.querySelector('.footer-phone');
  const fEmail = document.querySelector('.footer-email');
  const fAddr = document.querySelector('.footer-addr');
  const fb = document.querySelector('.social-fb');
  const ig = document.querySelector('.social-ig');
  if (fLogo) fLogo.src = d.site.logo;
  if (fDesc) fDesc.textContent = `${d.site.name} is a co-educational boarding institution, consisting of nursery, primary and senior secondary school children. GHA assures you quality education.`;
  if (fPhone) fPhone.textContent = [d.site.phone2, d.site.phone3, d.site.phone4].join(', ');
  if (fEmail) fEmail.textContent = d.site.email;
  if (fAddr) fAddr.textContent = d.site.address;
  if (fb) fb.href = d.site.facebook;
  if (ig) ig.href = d.site.instagram;
}

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.scorer-card, .level-card, .why-card, .facility-card, .news-card, .value-item, .stat-box, .facility-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ${i*0.06}s ease, transform 0.5s ${i*0.06}s ease`;
    observer.observe(el);
  });

  document.querySelectorAll('.in-view-trigger').forEach(el => observer.observe(el));
}

document.addEventListener('animationend', () => {}, { once: true });

// Triggered on intersection
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.scorer-card, .level-card, .why-card, .facility-card, .news-card, .value-item, .stat-box').forEach(el => {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    }, { threshold: 0.1 }).observe(el);
  });
}, { once: true });

/* ============================================================
   ADMIN SESSION
   ============================================================ */
function checkAdminSession() {
  const session = sessionStorage.getItem('gha_admin');
  const bar = document.querySelector('.admin-bar');
  if (session === 'true' && bar) {
    bar.classList.add('active');
  }
}

function adminLogout() {
  sessionStorage.removeItem('gha_admin');
  document.querySelector('.admin-bar')?.classList.remove('active');
  showToast('Logged out successfully.', 'var(--slate)');
}

function showToast(msg, bg = 'var(--green-accent)') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.background = bg;
  t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, 3000);
}

// Global exposure
window.openNewsModal = openNewsModal;
window.closeModal = closeModal;
window.adminLogout = adminLogout;
window.renderSite = renderSite;
window.showToast = showToast;
