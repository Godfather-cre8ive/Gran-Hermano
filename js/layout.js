/* ============================================================
   Shared layout JS — included on every inner page
   Builds the topbar + navbar + footer from GHA_DATA
   ============================================================ */
(function () {
  function buildTopbar() {
    const d = GHA_DATA.site;
    const el = document.getElementById('topbar');
    if (!el) return;
    el.innerHTML = `
      <div class="container">
        <div class="topbar-left">
          <span class="admission-badge">🎓 ${d.admissionBanner}</span>
          <a href="tel:${d.phone1}" class="topbar-phone">📞 ${d.phone1}</a>
          <a href="mailto:${d.email}" class="topbar-email">✉ ${d.email}</a>
        </div>
        <div class="topbar-right">
          <a href="https://resultchecking.granhermano.sch.ng" target="_blank">Result Checking</a>
          <a href="../admin.html" style="color:var(--gold-light)">Admin</a>
        </div>
      </div>`;
  }

  function buildNavbar() {
    const el = document.getElementById('main-navbar');
    if (!el) return;
    el.className = 'navbar';
    el.innerHTML = `
      <div class="container">
        <a href="../index.html" class="navbar-logo" style="display:flex;align-items:center;gap:.75rem;text-decoration:none">
          <img src="${GHA_DATA.site.logo}" alt="GHA Logo">
        </a>
        <ul class="nav-menu" id="nav-menu">
          <li class="nav-item"><a href="../index.html" class="nav-link">Home</a></li>
          <li class="nav-item">
            <a href="#" class="nav-link">About GHA <span class="arrow">▾</span></a>
            <div class="dropdown">
              <a href="about.html">Who We Are</a>
              <a href="values.html">Our Values &amp; Vision</a>
              <a href="chairman.html">Welcome From the Chairman</a>
              <a href="dos.html">Director of Studies</a>
              <a href="principal.html">Principal's Desk</a>
              <a href="headmistress.html">Headmistress Corner</a>
              <a href="management.html">Our Management</a>
              <a href="staff.html">Meet Our Staff</a>
            </div>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">Admission <span class="arrow">▾</span></a>
            <div class="dropdown">
              <a href="admission.html">Procedure &amp; Requirements</a>
              <a href="apply.html">Online Application</a>
              <a href="exam.html">Entrance Examination</a>
              <a href="cambridge.html">Cambridge</a>
            </div>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">Academics <span class="arrow">▾</span></a>
            <div class="dropdown">
              <a href="curriculum.html">Curriculum</a>
              <a href="medicals.html">Medicals</a>
              <a href="sports.html">Sports</a>
              <a href="bootcamps.html">Bootcamps</a>
              <a href="clubs.html">School Clubs</a>
              <a href="special.html">Special Classes</a>
            </div>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">Gallery <span class="arrow">▾</span></a>
            <div class="dropdown">
              <a href="gallery.html">Gallery</a>
              <a href="achievements.html">Achievements</a>
            </div>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">Events <span class="arrow">▾</span></a>
            <div class="dropdown">
              <a href="cultural.html">Cultural Day</a>
              <a href="holidays.html">Holidays</a>
            </div>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">School Tour <span class="arrow">▾</span></a>
            <div class="dropdown">
              <a href="hostel.html">Hostel</a>
              <a href="classrooms.html">Classrooms</a>
              <a href="exam-hall.html">Examination Hall</a>
              <a href="labs.html">Laboratories</a>
              <a href="dining.html">Dining Hall</a>
            </div>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">Portal <span class="arrow">▾</span></a>
            <div class="dropdown">
              <a href="https://resultchecking.granhermano.sch.ng" target="_blank">Result Checking</a>
              <a href="https://resultportal.granhermano.sch.ng" target="_blank">Teacher Login</a>
              <a href="https://sms.granhermano.sch.ng" target="_blank">Student Login</a>
              <a href="https://resultportal.granhermano.sch.ng" target="_blank">Principal Login</a>
            </div>
          </li>
          <li class="nav-item"><a href="../index.html#contact" class="nav-link">Contact</a></li>
        </ul>
        <a href="apply.html" class="btn btn--gold navbar-cta" style="font-size:.8rem;padding:.65rem 1.25rem">Apply Now</a>
        <button class="nav-hamburger" id="hamburger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>`;

    // scroll effect
    window.addEventListener('scroll', () => el.classList.toggle('scrolled', window.scrollY > 60));

    // hamburger
    document.getElementById('hamburger')?.addEventListener('click', () => {
      el.classList.toggle('nav-open');
    });
  }

  function buildFooter() {
    const el = document.getElementById('main-footer');
    if (!el) return;
    const d = GHA_DATA.site;
    el.className = 'footer';
    el.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <img src="${d.logo}" alt="GHA Logo">
            <p>Gran Hermano Academy is a co-educational boarding institution, consisting of nursery, primary and senior secondary school children. GHA assures you quality education.</p>
            <div class="footer-social">
              <a href="${d.facebook}" class="social-btn" target="_blank">f</a>
              <a href="${d.instagram}" class="social-btn" target="_blank">in</a>
              <a href="${d.twitter}" class="social-btn" target="_blank">𝕏</a>
              <a href="#" class="social-btn">▶</a>
            </div>
          </div>
          <div class="footer-col">
            <h5>Quick Links</h5>
            <ul>
              <li><a href="admission.html">Admission Requirements</a></li>
              <li><a href="apply.html">Online Application</a></li>
              <li><a href="../index.html#contact">Contact Us</a></li>
              <li><a href="about.html">About Us</a></li>
              <li><a href="staff.html">Our Staff</a></li>
              <li><a href="values.html">Values &amp; Vision</a></li>
              <li><a href="exam.html">Entrance Examination</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h5>Features</h5>
            <ul>
              <li><a href="sports.html">Sports</a></li>
              <li><a href="medicals.html">Medicals</a></li>
              <li><a href="hostel.html">Hostel</a></li>
              <li><a href="bootcamps.html">Bootcamp</a></li>
              <li><a href="gallery.html">Gallery</a></li>
              <li><a href="cambridge.html">Cambridge</a></li>
              <li><a href="achievements.html">Achievements</a></li>
            </ul>
          </div>
          <div class="footer-col footer-contact">
            <h5>Get in Touch</h5>
            <p>📞 ${d.phone2}, ${d.phone3}, ${d.phone4}</p>
            <p>✉ ${d.email}</p>
            <p>📍 ${d.address}</p>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          <p>Copyright &copy; ${new Date().getFullYear()} Gran Hermano Academy · All rights reserved</p>
          <p>Designed &amp; Developed by <a href="#">GHA ICT Department</a></p>
        </div>
      </div>`;
  }

  function buildBackTop() {
    const bt = document.getElementById('back-top');
    if (!bt) return;
    window.addEventListener('scroll', () => bt.classList.toggle('visible', window.scrollY > 400));
    bt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Run on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    buildTopbar();
    buildNavbar();
    buildFooter();
    buildBackTop();
  });
})();
