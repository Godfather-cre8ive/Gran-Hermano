/* ============================================================
   Gran Hermano Academy — Admin Portal JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('admin-login-form');
  const loginError = document.getElementById('login-error');

  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('admin-user').value.trim();
    const pass = document.getElementById('admin-pass').value;

    if (user === ADMIN_CREDENTIALS.username && pass === ADMIN_CREDENTIALS.password) {
      sessionStorage.setItem('gha_admin', 'true');
      window.location.href = 'admin-dashboard.html';
    } else {
      if (loginError) {
        loginError.textContent = 'Invalid username or password.';
        loginError.style.display = 'block';
      }
      document.getElementById('admin-pass').value = '';
    }
  });
});

/* ============================================================
   DASHBOARD
   ============================================================ */
function initDashboard() {
  // Check session
  if (sessionStorage.getItem('gha_admin') !== 'true') {
    window.location.href = 'admin.html';
    return;
  }

  // Sidebar nav
  document.querySelectorAll('.sidebar-nav a[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      showAdminPage(page);
      document.querySelectorAll('.sidebar-nav a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Logout
  document.querySelector('.admin-logout')?.addEventListener('click', () => {
    sessionStorage.removeItem('gha_admin');
    window.location.href = 'admin.html';
  });

  // Init all forms
  initSiteForm();
  initHeroForm();
  initAdmissionForm();
  initJambForm();
  initSectionsForm();
  initAboutForm();
  initWhyChooseForm();
  initFacilitiesForm();
  initAnthemForm();
  initVisionForm();
  initNewsForm();

  // Show first page
  showAdminPage('dashboard');
}

function showAdminPage(id) {
  document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${id}`)?.classList.add('active');
}

function saveAndToast(msg) {
  saveData();
  const t = document.getElementById('save-toast');
  if (t) {
    t.textContent = msg || '✓ Changes saved successfully!';
    t.style.display = 'block';
    setTimeout(() => { t.style.display = 'none'; }, 2800);
  }
}

/* ---- SITE SETTINGS ---- */
function initSiteForm() {
  const d = GHA_DATA.site;
  const form = document.getElementById('site-form');
  if (!form) return;
  form.innerHTML = `
    <div class="admin-card">
      <h3>🏫 School Information</h3>
      <div class="admin-grid-2">
        <div class="admin-field"><label>School Name</label><input id="s-name" value="${d.name}"></div>
        <div class="admin-field"><label>Tagline</label><input id="s-tagline" value="${d.tagline}"></div>
      </div>
      <div class="admin-grid-3">
        <div class="admin-field"><label>Phone 1</label><input id="s-p1" value="${d.phone1}"></div>
        <div class="admin-field"><label>Phone 2</label><input id="s-p2" value="${d.phone2}"></div>
        <div class="admin-field"><label>Phone 3</label><input id="s-p3" value="${d.phone3}"></div>
      </div>
      <div class="admin-grid-2">
        <div class="admin-field"><label>Email</label><input id="s-email" value="${d.email}"></div>
        <div class="admin-field"><label>Logo URL</label><input id="s-logo" value="${d.logo}"></div>
      </div>
      <div class="admin-field"><label>Address</label><input id="s-addr" value="${d.address}"></div>
      <div class="admin-field"><label>Admission Banner Text</label><input id="s-banner" value="${d.admissionBanner}"></div>
      <div class="admin-grid-2">
        <div class="admin-field"><label>Facebook URL</label><input id="s-fb" value="${d.facebook}"></div>
        <div class="admin-field"><label>Instagram URL</label><input id="s-ig" value="${d.instagram}"></div>
      </div>
      <div class="admin-field">
        <label>Admissions Open</label>
        <select id="s-admopen">
          <option value="true" ${d.admissionOpen?'selected':''}>Yes — Open</option>
          <option value="false" ${!d.admissionOpen?'selected':''}>No — Closed</option>
        </select>
      </div>
      <button class="save-btn" onclick="saveSiteForm()">💾 Save Changes</button>
    </div>
  `;
}

function saveSiteForm() {
  GHA_DATA.site.name = document.getElementById('s-name').value;
  GHA_DATA.site.tagline = document.getElementById('s-tagline').value;
  GHA_DATA.site.phone1 = document.getElementById('s-p1').value;
  GHA_DATA.site.phone2 = document.getElementById('s-p2').value;
  GHA_DATA.site.phone3 = document.getElementById('s-p3').value;
  GHA_DATA.site.email = document.getElementById('s-email').value;
  GHA_DATA.site.logo = document.getElementById('s-logo').value;
  GHA_DATA.site.address = document.getElementById('s-addr').value;
  GHA_DATA.site.admissionBanner = document.getElementById('s-banner').value;
  GHA_DATA.site.facebook = document.getElementById('s-fb').value;
  GHA_DATA.site.instagram = document.getElementById('s-ig').value;
  GHA_DATA.site.admissionOpen = document.getElementById('s-admopen').value === 'true';
  saveAndToast();
}

/* ---- HERO SLIDES ---- */
function initHeroForm() {
  renderHeroAdmin();
}

function renderHeroAdmin() {
  const container = document.getElementById('hero-slides-list');
  if (!container) return;
  const slides = GHA_DATA.hero.slides;
  container.innerHTML = slides.map((s, i) => `
    <div class="admin-list-item" id="slide-item-${i}">
      <img src="${s.image}" alt="Slide ${i+1}" onerror="this.src='https://via.placeholder.com/56x56?text=IMG'">
      <div class="info">
        <strong>${s.headline}</strong>
        <span>${s.sub}</span>
      </div>
      <div class="actions">
        <button class="btn-edit" onclick="editSlide(${i})">Edit</button>
        <button class="btn-delete" onclick="deleteSlide(${i})">Delete</button>
      </div>
    </div>
  `).join('');
}

function editSlide(i) {
  const s = GHA_DATA.hero.slides[i];
  const modal = document.getElementById('slide-modal');
  document.getElementById('slide-idx').value = i;
  document.getElementById('slide-img').value = s.image;
  document.getElementById('slide-headline').value = s.headline;
  document.getElementById('slide-sub').value = s.sub;
  modal.style.display = 'flex';
}

function deleteSlide(i) {
  if (confirm('Delete this slide?')) {
    GHA_DATA.hero.slides.splice(i, 1);
    saveAndToast('Slide deleted.');
    renderHeroAdmin();
  }
}

function addSlide() {
  const modal = document.getElementById('slide-modal');
  document.getElementById('slide-idx').value = -1;
  document.getElementById('slide-img').value = '';
  document.getElementById('slide-headline').value = '';
  document.getElementById('slide-sub').value = '';
  modal.style.display = 'flex';
}

function saveSlideModal() {
  const i = parseInt(document.getElementById('slide-idx').value);
  const obj = {
    image: document.getElementById('slide-img').value,
    headline: document.getElementById('slide-headline').value,
    sub: document.getElementById('slide-sub').value
  };
  if (i === -1) {
    GHA_DATA.hero.slides.push(obj);
  } else {
    GHA_DATA.hero.slides[i] = obj;
  }
  closeSlideModal();
  renderHeroAdmin();
  saveAndToast();
}

function closeSlideModal() {
  document.getElementById('slide-modal').style.display = 'none';
}

/* ---- ADMISSION ---- */
function initAdmissionForm() {
  const a = GHA_DATA.admission;
  const form = document.getElementById('admission-form');
  if (!form) return;
  form.innerHTML = `
    <div class="admin-card">
      <h3>📋 Admission Section</h3>
      <div class="admin-field"><label>Headline</label><input id="a-head" value="${a.headline}"></div>
      <div class="admin-field"><label>Subtitle</label><input id="a-sub" value="${a.sub}"></div>
      <div class="admin-field"><label>Exam Dates Text</label><input id="a-exam" value="${a.examDates}"></div>
      <div class="admin-field"><label>Countdown Target (ISO date)</label><input id="a-cd" value="${a.countdownTarget}"></div>
      <div class="admin-grid-2">
        <div class="admin-field"><label>CTA Button Text</label><input id="a-cta" value="${a.ctaText}"></div>
        <div class="admin-field"><label>CTA Button Link</label><input id="a-ctalink" value="${a.ctaLink}"></div>
      </div>
      <button class="save-btn" onclick="saveAdmissionForm()">💾 Save Changes</button>
    </div>
  `;
}

function saveAdmissionForm() {
  GHA_DATA.admission.headline = document.getElementById('a-head').value;
  GHA_DATA.admission.sub = document.getElementById('a-sub').value;
  GHA_DATA.admission.examDates = document.getElementById('a-exam').value;
  GHA_DATA.admission.countdownTarget = document.getElementById('a-cd').value;
  GHA_DATA.admission.ctaText = document.getElementById('a-cta').value;
  GHA_DATA.admission.ctaLink = document.getElementById('a-ctalink').value;
  saveAndToast();
}

/* ---- JAMB SCORERS ---- */
function initJambForm() {
  renderJambAdmin();
}

function renderJambAdmin() {
  const container = document.getElementById('jamb-list');
  if (!container) return;
  const { year, title, scorers } = GHA_DATA.jamb;

  const header = document.getElementById('jamb-meta-form');
  if (header) {
    header.innerHTML = `
      <div class="admin-card">
        <h3>🏅 JAMB Section Meta</h3>
        <div class="admin-grid-2">
          <div class="admin-field"><label>Year</label><input id="j-year" value="${year}"></div>
          <div class="admin-field"><label>Section Title</label><input id="j-title" value="${title}"></div>
        </div>
        <button class="save-btn" onclick="saveJambMeta()">💾 Save Meta</button>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="admin-card">
      <h3>🎓 JAMB Top Scorers</h3>
      <button class="btn-add" onclick="editScorer(-1)">+ Add Scorer</button>
      ${scorers.map((s, i) => `
        <div class="admin-list-item">
          <img src="${s.image}" alt="${s.name}" onerror="this.src='https://via.placeholder.com/56?text=GHA'">
          <div class="info">
            <strong>${s.name}</strong>
            <span>${s.year} · Total: ${s.total}</span>
          </div>
          <div class="actions">
            <button class="btn-edit" onclick="editScorer(${i})">Edit</button>
            <button class="btn-delete" onclick="deleteScorer(${i})">Delete</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function saveJambMeta() {
  GHA_DATA.jamb.year = document.getElementById('j-year').value;
  GHA_DATA.jamb.title = document.getElementById('j-title').value;
  saveAndToast();
}

function editScorer(i) {
  const s = i === -1 ? { name:'', year:'Year 12', image:'', total:0, scores:[{subj:'ENG',val:0},{subj:'BIO',val:0},{subj:'PHY',val:0},{subj:'CHEM',val:0}] } : GHA_DATA.jamb.scorers[i];
  const modal = document.getElementById('scorer-modal');
  document.getElementById('sc-idx').value = i;
  document.getElementById('sc-name').value = s.name;
  document.getElementById('sc-year').value = s.year;
  document.getElementById('sc-img').value = s.image;
  document.getElementById('sc-total').value = s.total;
  // Scores
  s.scores.forEach((sc, j) => {
    const si = document.getElementById(`sc-s${j}`);
    const vi = document.getElementById(`sc-v${j}`);
    if (si) si.value = sc.subj;
    if (vi) vi.value = sc.val;
  });
  modal.style.display = 'flex';
}

function saveScorer() {
  const i = parseInt(document.getElementById('sc-idx').value);
  const scores = [];
  for (let j = 0; j < 4; j++) {
    scores.push({ subj: document.getElementById(`sc-s${j}`).value, val: parseInt(document.getElementById(`sc-v${j}`).value) || 0 });
  }
  const obj = {
    name: document.getElementById('sc-name').value,
    year: document.getElementById('sc-year').value,
    image: document.getElementById('sc-img').value,
    total: parseInt(document.getElementById('sc-total').value) || 0,
    scores
  };
  if (i === -1) GHA_DATA.jamb.scorers.push(obj);
  else GHA_DATA.jamb.scorers[i] = obj;
  closeModal2('scorer-modal');
  renderJambAdmin();
  saveAndToast();
}

function deleteScorer(i) {
  if (confirm('Delete this scorer?')) {
    GHA_DATA.jamb.scorers.splice(i, 1);
    renderJambAdmin();
    saveAndToast('Scorer deleted.');
  }
}

/* ---- SCHOOL SECTIONS ---- */
function initSectionsForm() {
  renderSectionsAdmin();
}

function renderSectionsAdmin() {
  const container = document.getElementById('sections-form');
  if (!container) return;
  const keys = Object.keys(GHA_DATA.sections);
  container.innerHTML = keys.map(k => {
    const s = GHA_DATA.sections[k];
    return `
      <div class="admin-card">
        <h3>📚 ${s.title}</h3>
        <div class="admin-field"><label>Title</label><input id="sec-title-${k}" value="${s.title}"></div>
        <div class="admin-field"><label>Image URL</label><input id="sec-img-${k}" value="${s.image}"></div>
        <div class="admin-field"><label>Description</label><textarea id="sec-desc-${k}">${s.description}</textarea></div>
        <div class="admin-field"><label>CTA Text</label><input id="sec-cta-${k}" value="${s.cta}"></div>
        <button class="save-btn" onclick="saveSectionItem('${k}')">💾 Save ${s.title}</button>
      </div>
    `;
  }).join('');
}

function saveSectionItem(k) {
  GHA_DATA.sections[k].title = document.getElementById(`sec-title-${k}`).value;
  GHA_DATA.sections[k].image = document.getElementById(`sec-img-${k}`).value;
  GHA_DATA.sections[k].description = document.getElementById(`sec-desc-${k}`).value;
  GHA_DATA.sections[k].cta = document.getElementById(`sec-cta-${k}`).value;
  saveAndToast();
}

/* ---- ABOUT ---- */
function initAboutForm() {
  const a = GHA_DATA.about;
  const form = document.getElementById('about-form');
  if (!form) return;
  form.innerHTML = `
    <div class="admin-card">
      <h3>ℹ️ About Section</h3>
      <div class="admin-field"><label>Section Title</label><input id="ab-title" value="${a.title}"></div>
      <div class="admin-field"><label>Image URL</label><input id="ab-img" value="${a.image}"></div>
      <div class="admin-field"><label>Body Text</label><textarea id="ab-body" rows="6">${a.body}</textarea></div>
      <h4 style="margin:1rem 0 0.75rem;font-size:1rem">Stats</h4>
      ${a.stats.map((s, i) => `
        <div class="admin-grid-2" style="margin-bottom:0.75rem">
          <div class="admin-field"><label>Stat ${i+1} Value</label><input id="ab-sv${i}" value="${s.value}"></div>
          <div class="admin-field"><label>Stat ${i+1} Label</label><input id="ab-sl${i}" value="${s.label}"></div>
        </div>
      `).join('')}
      <button class="save-btn" onclick="saveAboutForm()">💾 Save Changes</button>
    </div>
  `;
}

function saveAboutForm() {
  GHA_DATA.about.title = document.getElementById('ab-title').value;
  GHA_DATA.about.image = document.getElementById('ab-img').value;
  GHA_DATA.about.body = document.getElementById('ab-body').value;
  GHA_DATA.about.stats.forEach((s, i) => {
    GHA_DATA.about.stats[i].value = document.getElementById(`ab-sv${i}`).value;
    GHA_DATA.about.stats[i].label = document.getElementById(`ab-sl${i}`).value;
  });
  saveAndToast();
}

/* ---- WHY CHOOSE ---- */
function initWhyChooseForm() {
  renderWhyAdmin();
}

function renderWhyAdmin() {
  const container = document.getElementById('why-form');
  if (!container) return;
  const w = GHA_DATA.whyChoose;
  container.innerHTML = `
    <div class="admin-card">
      <h3>✅ Section Meta</h3>
      <div class="admin-field"><label>Title</label><input id="w-title" value="${w.title}"></div>
      <div class="admin-field"><label>Subtitle</label><textarea id="w-sub">${w.subtitle}</textarea></div>
      <button class="save-btn" onclick="saveWhyMeta()">💾 Save Meta</button>
    </div>
    <div class="admin-card">
      <h3>📝 Why Choose Items</h3>
      <button class="btn-add" onclick="editWhyItem(-1)">+ Add Item</button>
      ${w.items.map((item, i) => `
        <div class="admin-list-item">
          <img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/56?text=IMG'">
          <div class="info">
            <strong>${item.title}</strong>
            <span>${item.description.substring(0,80)}...</span>
          </div>
          <div class="actions">
            <button class="btn-edit" onclick="editWhyItem(${i})">Edit</button>
            <button class="btn-delete" onclick="deleteWhyItem(${i})">Delete</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function saveWhyMeta() {
  GHA_DATA.whyChoose.title = document.getElementById('w-title').value;
  GHA_DATA.whyChoose.subtitle = document.getElementById('w-sub').value;
  saveAndToast();
}

function editWhyItem(i) {
  const item = i === -1 ? { title:'', image:'', description:'' } : GHA_DATA.whyChoose.items[i];
  const modal = document.getElementById('why-modal');
  document.getElementById('wi-idx').value = i;
  document.getElementById('wi-title').value = item.title;
  document.getElementById('wi-img').value = item.image;
  document.getElementById('wi-desc').value = item.description;
  modal.style.display = 'flex';
}

function saveWhyItem() {
  const i = parseInt(document.getElementById('wi-idx').value);
  const obj = {
    title: document.getElementById('wi-title').value,
    image: document.getElementById('wi-img').value,
    description: document.getElementById('wi-desc').value
  };
  if (i === -1) GHA_DATA.whyChoose.items.push(obj);
  else GHA_DATA.whyChoose.items[i] = obj;
  closeModal2('why-modal');
  renderWhyAdmin();
  saveAndToast();
}

function deleteWhyItem(i) {
  if (confirm('Delete this item?')) {
    GHA_DATA.whyChoose.items.splice(i, 1);
    renderWhyAdmin();
    saveAndToast('Item deleted.');
  }
}

/* ---- FACILITIES ---- */
function initFacilitiesForm() {
  renderFacilitiesAdmin();
}

function renderFacilitiesAdmin() {
  const container = document.getElementById('facilities-form');
  if (!container) return;
  container.innerHTML = `
    <div class="admin-card">
      <h3>🏗️ Facilities</h3>
      <button class="btn-add" onclick="editFacility(-1)">+ Add Facility</button>
      ${GHA_DATA.facilities.map((f, i) => `
        <div class="admin-list-item">
          <img src="${f.image}" alt="${f.title}" onerror="this.src='https://via.placeholder.com/56?text=IMG'">
          <div class="info">
            <strong>${f.title}</strong>
            <span>${f.description.substring(0,80)}...</span>
          </div>
          <div class="actions">
            <button class="btn-edit" onclick="editFacility(${i})">Edit</button>
            <button class="btn-delete" onclick="deleteFacility(${i})">Delete</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function editFacility(i) {
  const f = i === -1 ? { title:'', image:'', description:'' } : GHA_DATA.facilities[i];
  const modal = document.getElementById('facility-modal');
  document.getElementById('fac-idx').value = i;
  document.getElementById('fac-title').value = f.title;
  document.getElementById('fac-img').value = f.image;
  document.getElementById('fac-desc').value = f.description;
  modal.style.display = 'flex';
}

function saveFacility() {
  const i = parseInt(document.getElementById('fac-idx').value);
  const obj = {
    title: document.getElementById('fac-title').value,
    image: document.getElementById('fac-img').value,
    description: document.getElementById('fac-desc').value
  };
  if (i === -1) GHA_DATA.facilities.push(obj);
  else GHA_DATA.facilities[i] = obj;
  closeModal2('facility-modal');
  renderFacilitiesAdmin();
  saveAndToast();
}

function deleteFacility(i) {
  if (confirm('Delete this facility?')) {
    GHA_DATA.facilities.splice(i, 1);
    renderFacilitiesAdmin();
    saveAndToast('Facility deleted.');
  }
}

/* ---- ANTHEM ---- */
function initAnthemForm() {
  const a = GHA_DATA.anthem;
  const form = document.getElementById('anthem-form');
  if (!form) return;
  form.innerHTML = `
    <div class="admin-card">
      <h3>🎵 School Anthem</h3>
      <div class="admin-grid-2">
        <div class="admin-field"><label>Verse 1</label><textarea id="an-v1" rows="10">${a.verse1}</textarea></div>
        <div class="admin-field"><label>Verse 2</label><textarea id="an-v2" rows="10">${a.verse2}</textarea></div>
      </div>
      <button class="save-btn" onclick="saveAnthemForm()">💾 Save Anthem</button>
    </div>
  `;
}

function saveAnthemForm() {
  GHA_DATA.anthem.verse1 = document.getElementById('an-v1').value;
  GHA_DATA.anthem.verse2 = document.getElementById('an-v2').value;
  saveAndToast();
}

/* ---- VISION & VALUES ---- */
function initVisionForm() {
  renderVisionAdmin();
}

function renderVisionAdmin() {
  const container = document.getElementById('vision-form');
  if (!container) return;
  const v = GHA_DATA.vision;
  container.innerHTML = `
    <div class="admin-card">
      <h3>🎯 Vision & Mission</h3>
      <div class="admin-field"><label>Vision Statement</label><textarea id="vis-text">${v.text}</textarea></div>
      <div class="admin-field"><label>Mission Statement</label><textarea id="vis-mission" rows="4">${v.mission}</textarea></div>
      <div class="admin-field"><label>Values Section Image URL</label><input id="vis-img" value="${v.image}"></div>
      <button class="save-btn" onclick="saveVisionMeta()">💾 Save Vision & Mission</button>
    </div>
    <div class="admin-card">
      <h3>💎 Core Values</h3>
      <button class="btn-add" onclick="editValue(-1)">+ Add Value</button>
      ${v.coreValues.map((val, i) => `
        <div class="admin-list-item">
          <div class="info">
            <strong>${val.name}</strong>
            <span>${val.desc.substring(0,80)}...</span>
          </div>
          <div class="actions">
            <button class="btn-edit" onclick="editValue(${i})">Edit</button>
            <button class="btn-delete" onclick="deleteValue(${i})">Delete</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function saveVisionMeta() {
  GHA_DATA.vision.text = document.getElementById('vis-text').value;
  GHA_DATA.vision.mission = document.getElementById('vis-mission').value;
  GHA_DATA.vision.image = document.getElementById('vis-img').value;
  saveAndToast();
}

function editValue(i) {
  const val = i === -1 ? { name:'', desc:'' } : GHA_DATA.vision.coreValues[i];
  const modal = document.getElementById('value-modal');
  document.getElementById('val-idx').value = i;
  document.getElementById('val-name').value = val.name;
  document.getElementById('val-desc').value = val.desc;
  modal.style.display = 'flex';
}

function saveValue() {
  const i = parseInt(document.getElementById('val-idx').value);
  const obj = {
    name: document.getElementById('val-name').value,
    desc: document.getElementById('val-desc').value
  };
  if (i === -1) GHA_DATA.vision.coreValues.push(obj);
  else GHA_DATA.vision.coreValues[i] = obj;
  closeModal2('value-modal');
  renderVisionAdmin();
  saveAndToast();
}

function deleteValue(i) {
  if (confirm('Delete this core value?')) {
    GHA_DATA.vision.coreValues.splice(i, 1);
    renderVisionAdmin();
    saveAndToast('Value deleted.');
  }
}

/* ---- NEWS ---- */
function initNewsForm() {
  renderNewsAdmin();
}

function renderNewsAdmin() {
  const container = document.getElementById('news-form');
  if (!container) return;
  container.innerHTML = `
    <div class="admin-card">
      <h3>📰 News & Events</h3>
      <button class="btn-add" onclick="editNews(-1)">+ Add News Item</button>
      ${GHA_DATA.news.map((n, i) => `
        <div class="admin-list-item">
          <img src="${n.image}" alt="${n.title}" onerror="this.src='https://via.placeholder.com/56?text=NEWS'">
          <div class="info">
            <strong>${n.title}</strong>
            <span>${n.date} · ${n.category}</span>
          </div>
          <div class="actions">
            <button class="btn-edit" onclick="editNews(${i})">Edit</button>
            <button class="btn-delete" onclick="deleteNews(${i})">Delete</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function editNews(i) {
  const n = i === -1 ? { title:'', date:'', category:'Events', excerpt:'', content:'', image:'', author:'GHA ICT' } : GHA_DATA.news[i];
  const modal = document.getElementById('news-modal');
  document.getElementById('nw-idx').value = i;
  document.getElementById('nw-title').value = n.title;
  document.getElementById('nw-date').value = n.date;
  document.getElementById('nw-cat').value = n.category;
  document.getElementById('nw-img').value = n.image;
  document.getElementById('nw-author').value = n.author;
  document.getElementById('nw-excerpt').value = n.excerpt;
  document.getElementById('nw-content').value = n.content;
  modal.style.display = 'flex';
}

function saveNews() {
  const i = parseInt(document.getElementById('nw-idx').value);
  const obj = {
    id: i === -1 ? Date.now() : GHA_DATA.news[i].id,
    title: document.getElementById('nw-title').value,
    date: document.getElementById('nw-date').value,
    category: document.getElementById('nw-cat').value,
    image: document.getElementById('nw-img').value,
    author: document.getElementById('nw-author').value,
    excerpt: document.getElementById('nw-excerpt').value,
    content: document.getElementById('nw-content').value
  };
  if (i === -1) GHA_DATA.news.unshift(obj);
  else GHA_DATA.news[i] = obj;
  closeModal2('news-modal');
  renderNewsAdmin();
  saveAndToast();
}

function deleteNews(i) {
  if (confirm('Delete this news item?')) {
    GHA_DATA.news.splice(i, 1);
    renderNewsAdmin();
    saveAndToast('News item deleted.');
  }
}

/* ---- MODAL HELPERS ---- */
function closeModal2(id) {
  document.getElementById(id).style.display = 'none';
}

/* ---- ADMIN PASSWORD CHANGE ---- */
function savePasswordChange() {
  const cur = document.getElementById('pw-current').value;
  const nw = document.getElementById('pw-new').value;
  const cf = document.getElementById('pw-confirm').value;
  if (cur !== ADMIN_CREDENTIALS.password) {
    alert('Current password is incorrect.'); return;
  }
  if (nw !== cf) { alert('New passwords do not match.'); return; }
  if (nw.length < 6) { alert('Password must be at least 6 characters.'); return; }
  ADMIN_CREDENTIALS.password = nw;
  localStorage.setItem('gha_admin_pw', nw);
  document.getElementById('pw-current').value = '';
  document.getElementById('pw-new').value = '';
  document.getElementById('pw-confirm').value = '';
  saveAndToast('Password changed successfully!');
}

// Check saved PW
const savedPw = localStorage.getItem('gha_admin_pw');
if (savedPw) ADMIN_CREDENTIALS.password = savedPw;

// Expose globals
window.saveSiteForm = saveSiteForm;
window.saveAdmissionForm = saveAdmissionForm;
window.saveJambMeta = saveJambMeta;
window.editSlide = editSlide; window.deleteSlide = deleteSlide; window.addSlide = addSlide; window.saveSlideModal = saveSlideModal; window.closeSlideModal = closeSlideModal;
window.editScorer = editScorer; window.deleteScorer = deleteScorer; window.saveScorer = saveScorer;
window.saveSectionItem = saveSectionItem;
window.saveAboutForm = saveAboutForm;
window.saveWhyMeta = saveWhyMeta; window.editWhyItem = editWhyItem; window.deleteWhyItem = deleteWhyItem; window.saveWhyItem = saveWhyItem;
window.editFacility = editFacility; window.deleteFacility = deleteFacility; window.saveFacility = saveFacility;
window.saveAnthemForm = saveAnthemForm;
window.saveVisionMeta = saveVisionMeta; window.editValue = editValue; window.deleteValue = deleteValue; window.saveValue = saveValue;
window.editNews = editNews; window.deleteNews = deleteNews; window.saveNews = saveNews;
window.closeModal2 = closeModal2;
window.savePasswordChange = savePasswordChange;
window.showAdminPage = showAdminPage;
window.initDashboard = initDashboard;
