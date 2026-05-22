# Gran Hermano Academy — Premium Website

A fully featured, production-ready school website with an integrated admin portal for **Gran Hermano Academy**, Awka, Nigeria.

---

## 🌟 Features

### Frontend
- **Premium responsive design** — Deep Navy + Gold aesthetic, Cormorant Garamond + DM Sans typography
- **Full-page hero slider** with animated text and smooth transitions
- **Live countdown timer** for admission deadline
- **JAMB top scorers** showcase with medal rankings
- **School sections** — Crèche, Nursery, Primary, Secondary
- **Facilities gallery** with hover effects
- **News & Events** with modal reader
- **School Anthem** display
- **Vision, Mission & Core Values**
- **Interactive photo gallery** with lightbox and category filters
- **Online application form**
- **Google Maps embed**
- **Mobile-first responsive** — fully optimised for all devices
- **Smooth scroll animations** and micro-interactions
- **Back to top button**, sticky navbar with scroll effect

### Admin Portal
- **Secure login** (username + password, JWT-backed in backend mode)
- **Dashboard** with live site statistics
- **Edit everything without code:**
  - Site settings (name, phone, email, address, logo, social links)
  - Hero slideshow (add/edit/delete slides with image preview)
  - Admission section (headline, countdown date, exam dates, CTA)
  - JAMB scorers (add/edit/delete with scores and photos)
  - School sections (Crèche/Nursery/Primary/Secondary content)
  - About section (text, image, stats)
  - Why Choose GHA items (add/edit/delete)
  - Facilities (add/edit/delete)
  - School anthem (both verses)
  - Vision, Mission & Core Values
  - News & Events (publish/edit/delete articles)
  - Password change
- **Auto-save to localStorage** (frontend mode) or backend API (server mode)
- **Toast notifications** on every save action

### Backend (Node.js + Express)
- REST API for all content management
- JWT authentication for admin endpoints
- Application form submission storage
- Contact/enquiry management
- bcrypt password hashing
- Static file serving

### Pages Included
| Page | Description |
|------|-------------|
| `index.html` | Full homepage |
| `admin.html` | Admin login |
| `admin-dashboard.html` | Admin CMS dashboard |
| `pages/about.html` | About the school |
| `pages/values.html` | Vision, Mission & Values |
| `pages/chairman.html` | Chairman's message |
| `pages/dos.html` | Director of Studies |
| `pages/principal.html` | Principal's desk |
| `pages/headmistress.html` | Headmistress corner |
| `pages/management.html` | Management team |
| `pages/staff.html` | All staff |
| `pages/admission.html` | Admission requirements |
| `pages/apply.html` | Online application form |
| `pages/exam.html` | Entrance examination |
| `pages/cambridge.html` | Cambridge certification |
| `pages/curriculum.html` | Academic curriculum |
| `pages/sports.html` | Sports programme |
| `pages/medicals.html` | Medical services |
| `pages/bootcamps.html` | Bootcamp programmes |
| `pages/clubs.html` | School clubs & societies |
| `pages/special.html` | Special & after-school classes |
| `pages/gallery.html` | Photo gallery with lightbox |
| `pages/achievements.html` | Awards & achievements |
| `pages/cultural.html` | Cultural day |
| `pages/holidays.html` | Term dates & holidays |
| `pages/hostel.html` | Boarding/hostel life |
| `pages/classrooms.html` | Classrooms tour |
| `pages/exam-hall.html` | Examination hall |
| `pages/labs.html` | Laboratories |
| `pages/dining.html` | Dining hall |

---

## 🚀 Deployment

### Option A — Static Hosting (simplest)
Deploy the entire folder to any static host (Netlify, Vercel, GitHub Pages, cPanel, etc.).
No backend required — admin changes save to browser localStorage.

```bash
# Netlify drag-and-drop: simply upload the whole folder
# Or use Netlify CLI:
npm install -g netlify-cli
netlify deploy --prod --dir=.
```

### Option B — Node.js Server (full backend)

#### 1. Install dependencies
```bash
npm install
```

#### 2. Set up environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

#### 3. Initialise data
```bash
npm run init-data
```

#### 4. Start server
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

The site will be available at `http://localhost:3000`

#### 5. Deploy to a VPS (e.g. Ubuntu + Nginx)

```bash
# Install PM2
npm install -g pm2

# Start app with PM2
pm2 start server.js --name "gha-website"
pm2 save
pm2 startup

# Nginx config (create /etc/nginx/sites-available/gha)
server {
    listen 80;
    server_name granhermano.sch.ng www.granhermano.sch.ng;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site & reload Nginx
sudo ln -s /etc/nginx/sites-available/gha /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Add SSL with Certbot
sudo certbot --nginx -d granhermano.sch.ng -d www.granhermano.sch.ng
```

---

## 🔐 Admin Access

**URL:** `/admin.html`  
**Default credentials:**
- Username: `admin`
- Password: `gha@admin2025`

⚠️ **Change the default password immediately after first login** via Admin Dashboard → Security.

---

## 📁 File Structure

```
gran-hermano-academy/
├── index.html              # Homepage
├── admin.html              # Admin login
├── admin-dashboard.html    # Admin CMS
├── server.js               # Node.js backend
├── package.json
├── .env.example
├── .gitignore
│
├── css/
│   ├── style.css           # Main design system
│   └── pages.css           # Inner page styles
│
├── js/
│   ├── data.js             # All site content (single source of truth)
│   ├── main.js             # Homepage rendering & interactions
│   ├── admin.js            # Admin dashboard logic
│   └── layout.js           # Shared navbar/footer for inner pages
│
├── pages/                  # All inner pages (25+ pages)
│   ├── about.html
│   ├── apply.html
│   ├── gallery.html
│   └── ...
│
├── data/                   # Server-side JSON storage
│   ├── site-data.json      # Main content (auto-created)
│   ├── applications.json   # Admission applications
│   └── enquiries.json      # Contact form submissions
│
└── scripts/
    └── init-data.js        # Seeds initial data
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| Design | Custom CSS design system (no frameworks) |
| Fonts | Cormorant Garamond, DM Sans (Google Fonts) |
| Backend | Node.js + Express.js |
| Auth | JWT + bcryptjs |
| Storage | JSON files (upgradeable to MongoDB/PostgreSQL) |
| Deployment | Any static host, or Node.js server |

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | None | Admin login |
| POST | `/api/auth/verify` | JWT | Verify token |
| POST | `/api/auth/change-password` | JWT | Change password |
| GET | `/api/data` | None | Get all site data |
| PUT | `/api/data` | JWT | Update all site data |
| PATCH | `/api/data/:section` | JWT | Update one section |
| GET | `/api/news` | None | Get all news |
| POST | `/api/news` | JWT | Create news item |
| PUT | `/api/news/:id` | JWT | Update news item |
| DELETE | `/api/news/:id` | JWT | Delete news item |
| POST | `/api/apply` | None | Submit application |
| GET | `/api/applications` | JWT | List all applications |
| PATCH | `/api/applications/:id` | JWT | Update application status |
| POST | `/api/contact` | None | Submit enquiry |
| GET | `/api/enquiries` | JWT | List all enquiries |
| GET | `/api/health` | None | Health check |

---

## 💡 Upgrading to a Database

To use MongoDB instead of JSON files, install `mongoose` and replace the `readData`/`writeData` helpers in `server.js` with Mongoose model operations. The API interface stays identical.

---

## 📞 Support

For technical support, contact the GHA ICT Department:  
✉ info@granhermano.sch.ng  
📞 +2349060940593
