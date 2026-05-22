/**
 * Gran Hermano Academy — Backend Server
 * Express.js REST API + static file serving
 * Supports: content management, contact form, newsletter, application form
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'gha_super_secret_2025_change_in_production';
const DATA_FILE = path.join(__dirname, 'data', 'site-data.json');
const APPS_FILE = path.join(__dirname, 'data', 'applications.json');

// ---- Middleware ----
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname)));  // Serve frontend files

// ---- Data Helpers ----
function readData(file) {
  try {
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch { return null; }
}

function writeData(file, data) {
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    return true;
  } catch { return false; }
}

// ---- Auth Middleware ----
function authenticateToken(req, res, next) {
  const auth = req.headers['authorization'];
  const token = auth && auth.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorised' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden — invalid token' });
    req.user = user;
    next();
  });
}

// ============================================================
// AUTH ROUTES
// ============================================================

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  // Load admin credentials from env or default
  const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
  const ADMIN_HASH = process.env.ADMIN_PASSWORD_HASH || '$2a$10$rBV2JDeWW3.vKyeQcB3iMOqFt0VsZbHTgrwKiPFbNHwV3WlNRMNAC'; // bcrypt of 'gha@admin2025'

  if (username !== ADMIN_USER) return res.status(401).json({ error: 'Invalid credentials' });

  // Support plain text password for dev (hashed in production)
  const plainPass = process.env.ADMIN_PASSWORD || 'gha@admin2025';
  const match = password === plainPass || await bcrypt.compare(password, ADMIN_HASH);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, message: 'Login successful' });
});

// POST /api/auth/verify
app.post('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// ============================================================
// SITE DATA ROUTES
// ============================================================

// GET /api/data — return all site data
app.get('/api/data', (req, res) => {
  const data = readData(DATA_FILE);
  if (!data) return res.status(404).json({ error: 'No data found. Site data not yet initialised.' });
  res.json(data);
});

// PUT /api/data — update all site data (admin only)
app.put('/api/data', authenticateToken, (req, res) => {
  const data = req.body;
  if (!data || typeof data !== 'object') return res.status(400).json({ error: 'Invalid data' });
  const ok = writeData(DATA_FILE, data);
  if (!ok) return res.status(500).json({ error: 'Failed to save data' });
  res.json({ success: true, message: 'Site data updated successfully' });
});

// PATCH /api/data/:section — update a specific section
app.patch('/api/data/:section', authenticateToken, (req, res) => {
  const { section } = req.params;
  const existing = readData(DATA_FILE) || {};
  if (!existing[section]) return res.status(404).json({ error: `Section '${section}' not found` });
  existing[section] = { ...existing[section], ...req.body };
  const ok = writeData(DATA_FILE, existing);
  if (!ok) return res.status(500).json({ error: 'Failed to save' });
  res.json({ success: true, section, data: existing[section] });
});

// ============================================================
// NEWS ROUTES
// ============================================================

// GET /api/news
app.get('/api/news', (req, res) => {
  const data = readData(DATA_FILE);
  res.json(data?.news || []);
});

// POST /api/news (admin only)
app.post('/api/news', authenticateToken, (req, res) => {
  const data = readData(DATA_FILE) || {};
  if (!data.news) data.news = [];
  const item = { ...req.body, id: Date.now(), createdAt: new Date().toISOString() };
  data.news.unshift(item);
  writeData(DATA_FILE, data);
  res.status(201).json(item);
});

// PUT /api/news/:id (admin only)
app.put('/api/news/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const data = readData(DATA_FILE) || {};
  const idx = (data.news || []).findIndex(n => n.id === id);
  if (idx === -1) return res.status(404).json({ error: 'News item not found' });
  data.news[idx] = { ...data.news[idx], ...req.body, id };
  writeData(DATA_FILE, data);
  res.json(data.news[idx]);
});

// DELETE /api/news/:id (admin only)
app.delete('/api/news/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const data = readData(DATA_FILE) || {};
  data.news = (data.news || []).filter(n => n.id !== id);
  writeData(DATA_FILE, data);
  res.json({ success: true });
});

// ============================================================
// APPLICATIONS ROUTE
// ============================================================

// POST /api/apply — submit admission application
app.post('/api/apply', (req, res) => {
  const required = ['first_name', 'last_name', 'dob', 'gender', 'class', 'parent_name', 'phone', 'email'];
  const missing = required.filter(f => !req.body[f]);
  if (missing.length) return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });

  const apps = readData(APPS_FILE) || [];
  const application = {
    id: Date.now(),
    ...req.body,
    submittedAt: new Date().toISOString(),
    status: 'pending'
  };
  apps.push(application);
  writeData(APPS_FILE, apps);

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully. We will contact you within 24 hours.',
    applicationId: application.id
  });
});

// GET /api/applications — list all applications (admin only)
app.get('/api/applications', authenticateToken, (req, res) => {
  const apps = readData(APPS_FILE) || [];
  res.json(apps);
});

// PATCH /api/applications/:id — update status (admin only)
app.patch('/api/applications/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const apps = readData(APPS_FILE) || [];
  const idx = apps.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Application not found' });
  apps[idx] = { ...apps[idx], ...req.body };
  writeData(APPS_FILE, apps);
  res.json(apps[idx]);
});

// ============================================================
// CONTACT / ENQUIRY ROUTE
// ============================================================

// POST /api/contact
app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Name, email and message are required' });

  const enquiries = readData(path.join(__dirname, 'data', 'enquiries.json')) || [];
  enquiries.push({ id: Date.now(), name, email, phone, subject, message, receivedAt: new Date().toISOString(), read: false });
  writeData(path.join(__dirname, 'data', 'enquiries.json'), enquiries);

  res.json({ success: true, message: 'Your message has been received. We will get back to you shortly.' });
});

// GET /api/enquiries (admin only)
app.get('/api/enquiries', authenticateToken, (req, res) => {
  const enquiries = readData(path.join(__dirname, 'data', 'enquiries.json')) || [];
  res.json(enquiries);
});

// ============================================================
// ADMIN PASSWORD CHANGE
// ============================================================

// POST /api/auth/change-password (admin only)
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both passwords required' });
  if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const plain = process.env.ADMIN_PASSWORD || 'gha@admin2025';
  if (currentPassword !== plain) return res.status(401).json({ error: 'Current password incorrect' });

  const hash = await bcrypt.hash(newPassword, 10);
  // In production: save hash to .env or DB. Here we just confirm.
  res.json({ success: true, newHash: hash, message: 'Password hash generated. Update ADMIN_PASSWORD_HASH in .env' });
});

// ============================================================
// HEALTH CHECK
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'Gran Hermano Academy API', timestamp: new Date().toISOString() });
});

// ============================================================
// FALLBACK — serve index.html for SPA routing
// ============================================================
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'API endpoint not found' });
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================================
// START
// ============================================================
app.listen(PORT, () => {
  console.log(`\n✅ GHA Server running on http://localhost:${PORT}`);
  console.log(`   Admin Dashboard: http://localhost:${PORT}/admin.html`);
  console.log(`   API Health:      http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
