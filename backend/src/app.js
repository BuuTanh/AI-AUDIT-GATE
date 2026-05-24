require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');

const authRoutes     = require('./routes/auth');
const projectRoutes  = require('./routes/projects');
const documentRoutes = require('./routes/documents');
const approvalRoutes = require('./routes/approvals');
const sessionRoutes  = require('./routes/sessions');
const reportRoutes   = require('./routes/reports');
const aiRoutes       = require('./routes/ai');

const app = express();

// ── CORS ────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://localhost:3001',
];
app.use(cors({
  origin: function(origin, cb) {
    // Allow same-origin requests (no origin header) and whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
  credentials: true,
}));

// ── Body parsing ─────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static: serve uploaded PDFs ──────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── Production: serve frontend static files ──────────────────
// Activated when NODE_ENV=production (e.g. Render deploy) or SERVE_FRONTEND=true (local no-LiveServer)
if (process.env.NODE_ENV === 'production' || process.env.SERVE_FRONTEND === 'true') {
  const frontendRoot = path.join(__dirname, '../../');
  app.use(express.static(frontendRoot));
}

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/projects',  projectRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/sessions',  sessionRoutes);
app.use('/api/reports',   reportRoutes);
app.use('/api/ai',        aiRoutes);

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
